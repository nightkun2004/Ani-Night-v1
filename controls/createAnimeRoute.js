const AnimeMay = require('../models/animeMay');
const AnimeBord = require('../models/animebord');

exports.Addanimemay = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        // สร้างออบเจ็กต์ AnimeApril ใหม่จากข้อมูลที่รับมาจากฟอร์ม
        const newAnime = new AnimeMay({
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
        await AnimeBord.findOneAndUpdate({}, { $push: { animeMay: savedAnime._id }, $set: { author: author } }, { new: true, upsert: true });

        // เมื่อบันทึกสำเร็จ ส่งคำตอบกลับไปยังผู้ใช้
        res.status(201).send('บันทึกข้อมูลอนิเมะสำเร็จ');
    } catch (error) {
        // หากเกิดข้อผิดพลาด ส่งคำตอบกลับไปพร้อมข้อความผิดพลาด
        res.status(400).send(error.message);
    }
}

exports.EditanimeMay = async (req, res) => {
    const update_id = req.body.update_id;
    try {
        const animeBord = await AnimeMay.findOne({ _id: update_id });
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
        animeBord.Iqiyi = req.body.Iqiyi;
        animeBord.youtube = req.body.youtube;
        animeBord.yt_text = req.body.yt_text;
        animeBord.crunchyroll = req.body.crunchyroll;

        await animeBord.save();

        res.redirect('/admin/dash?alertMessageVideo=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
} 