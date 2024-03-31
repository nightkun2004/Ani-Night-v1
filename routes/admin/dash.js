const express = require('express')
const router = express.Router()
const verifyToken = require('../../middleware/auth')
const User = require('../../models/user')
const AnimeApril = require('../../models/animeApril')
const AnimeBord = require('../../models/animebord')
// const createAnime = require('../../controls/createAnimeRoute')

router.get('/admin/dash', verifyToken, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.render('./admin/dash', { userCount }); // ส่งข้อมูลผู้ใช้ไปยังหน้าจอ dash โดยใช้ EJS
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
    }
});

router.get('/admin/update_code', verifyToken, (req, res) => {
    res.render('./admin/updateReward');
});

router.get('/admin/createAnime', verifyToken, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/createAnime', { usersesstion });
});
router.post('/createAnime', verifyToken, async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        // สร้างออบเจ็กต์ AnimeApril ใหม่จากข้อมูลที่รับมาจากฟอร์ม
        const newAnime = new AnimeApril({
            nameAnime: req.body.nameAnime,
            Produced: req.body.Produced,
            manuscript: req.body.manuscript,
            episodes: req.body.episodes,
            start: req.body.start,
            linkImage: req.body.linkImage,
        });

        const author = {
            id: usersesstion._id,
            username: usersesstion.username,
            profile: usersesstion.profile
        };

        // เพิ่มข้อมูลผู้เขียนลงในออบเจ็กต์ AnimeApril
        newAnime.author = author;

        // บันทึกออบเจ็กต์ AnimeApril ลงในฐานข้อมูล
        const savedAnime = await newAnime.save();

        // เพิ่ม ObjectId ของ AnimeApril ลงในฟิลด์ animeApril ในโมเดล AnimeBord
        await AnimeBord.findOneAndUpdate({}, { $push: { animeApril: savedAnime._id }, $set: { author: author } }, { new: true, upsert: true });

        // เมื่อบันทึกสำเร็จ ส่งคำตอบกลับไปยังผู้ใช้
        res.status(201).send('บันทึกข้อมูลอนิเมะสำเร็จ');
    } catch (error) {
        // หากเกิดข้อผิดพลาด ส่งคำตอบกลับไปพร้อมข้อความผิดพลาด
        res.status(400).send(error.message);
    }
})

async function loadAnimeData(req, res, next) {
    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril'); 
        req.AnimeBordData = AnimeBordData;
        next();
    } catch (error) {
        next(error);
    }
}

router.get('/edit/anime/boards', loadAnimeData, async (req,res) => {
    const usersesstion = req.session.userlogin;

    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril'); 
        if (!AnimeBordData) {
            return res.status(404).json({ error: "AnimeBordData not found" });
        }

        res.render('./admin/edits/adminboards', {usersesstion, AnimeBordData})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post('/edit_animeboard', async (req,res) => {
    const usersesstion = req.session.userlogin;
    const edit_id = req.body.edit_id;
    try {
        const animeApril = await AnimeApril.findOne({ _id: edit_id }).exec();

        if (!animeApril) {
            return res.status(404).json({ error: "AnimeApril not found" });
        }

        res.render('./admin/edits/animebord', { active: 'dashboard', animeApril, usersesstion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/edit_animeboard/one', verifyToken, async (req, res) => {
    const update_id = req.body.update_id;
    try {
        const animeBord = await AnimeApril.findOne({ _id: update_id });
        if (!animeBord) {
            return res.status(404).json({ error: "AnimeBord not found" });
        }

        animeBord.nameAnime = req.body.nameAnime;
        animeBord.Produced = req.body.Produced;
        animeBord.manuscript = req.body.manuscript;
        animeBord.episodes = req.body.episodes;
        animeBord.start = req.body.start;
        animeBord.linkImage = req.body.linkImage;
        animeBord.info = req.body.info;
        animeBord.web = req.body.web;
        animeBord.bilibili = req.body.bilibili;
        animeBord.nameep = req.body.nameep;

        await animeBord.save();

        res.redirect('/admin/dash?alertMessageVideo=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/admin/update_link', verifyToken, (req, res) => {
    res.render('./admin/updatelink');
});

router.get('/success', (req, res) => {
    res.render('success')
})

module.exports = router