const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Acticle = require("../models/acticle")

function setLanguage(req, res, next) {
    const lang = req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน Header Accept-Language ให้เริ่มต้นเป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

router.get('/trending', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const topViewedActicles = await Acticle.find().sort({ views: -1 }).limit(10);

        const template = req.language === 'th' ? './component/trending' : './en/trending';

        res.render(template, {
            active: 'trending',
            usersesstion,
            language: req.language,
            topViewedActicles
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

module.exports = router