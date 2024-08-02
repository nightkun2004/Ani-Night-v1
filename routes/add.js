const express = require("express");
const router = express.Router();
const Video = require('../models/video')
const Add = require('../controls/addController')
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")

router.post('/add_subthai', Add.Addsubthai)
router.post('/add/upload/banner', Add.AddBanner)
router.post('/add_ottplatforms', Add.AddOTT)
router.post('/save_ott', Add.addLinkPathform)

router.post('/add/subthai',  async (req, res) => {
    const sub_id = req.body.sub_id;
    const filesubtitle = req.files && req.files.subtitles; // ตรวจสอบว่ามีไฟล์หรือไม่

    try {
        if (!filesubtitle) {
            return res.status(404).json({ message: "ไม่พบไฟล์ซับ" });
        }

        // กำหนดชื่อไฟล์ซับและเส้นทาง
        const subtitleFilename = `${crypto.randomUUID()}.vtt`; // หรือสกุลไฟล์อื่นที่ใช้งาน
        const subtitleUploadPath = path.join(__dirname, '..', 'src', 'public', 'subtitles', subtitleFilename);

        // อัปโหลดไฟล์ซับ
        await filesubtitle.mv(subtitleUploadPath);

        // อัปเดตข้อมูลซับในฐานข้อมูล
        await Video.findByIdAndUpdate(
            sub_id,
            { $set: { subthai: subtitleFilename } },
            { new: true }
        );

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


module.exports = router