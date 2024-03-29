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

router.get('/admin/update_link', verifyToken, (req, res) => {
    res.render('./admin/updatelink');
});

router.get('/success', (req, res) => {
    res.render('success')
})

module.exports = router