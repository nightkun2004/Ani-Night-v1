const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const animebord = require('../models/animebord');
const animeApril = require("../models/animeApril");
const animeMay = require("../models/animeMay");
const animeJuly = require("../models/animeJuly");
const animeJune = require("../models/animeJune");

router.get('/anime/:animeid', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const animeid = req.params.animeid;

        // ตรวจสอบว่า animeid เป็น ObjectId ที่ถูกต้อง
        if (!mongoose.Types.ObjectId.isValid(animeid)) {
            return res.render("404", { usersesstion });
        }

        // หาข้อมูลจากหลาย ๆ คอลเลคชัน
        let AnimeDataset = await animeApril.findOne({_id: animeid})
            || await animeMay.findOne({_id: animeid})
            || await animeJuly.findOne({_id: animeid})
            || await animeJune.findOne({_id: animeid});

        if (!AnimeDataset) {
            return res.render("404", { usersesstion});
        }
        
        // console.log(AnimeDataset);

        // ส่งข้อมูลไปที่หน้าเว็บผ่าน EJS template
        res.render('./component/info', { usersesstion, AnimeDataset });
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