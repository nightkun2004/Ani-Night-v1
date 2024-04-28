const express = require("express");
const router = express.Router();
const animebord = require('../models/animebord');

router.get('/info/:animeid', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const animeid = req.params.animeid;

        let animebordData;

        animebordData = await animebord.findOne({ 'animeApril': animeid })
            .populate('animeApril animeMay animeJuly').exec();

        if (!animebordData) {
            animebordData = await animebord.findOne({ 'animeMay': animeid })
                .populate('animeApril animeMay animeJuly').exec();
        }

        if (!animebordData) {
            animebordData = await animebord.findOne({ 'animeJuly': animeid })
                .populate('animeApril animeMay animeJuly').exec();
        }


        // ส่งข้อมูลไปที่หน้าเว็บผ่าน EJS template
        res.render('./component/info', { usersesstion, animebordData });
        // res.json(animebordData)
    } catch (err) {
        if (err.response && err.response.status === 404) {
            // ถ้าไม่พบข้อมูลอนิเมะที่ระบุ
            res.status(404).send('Anime not found');
            return;
        }
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;