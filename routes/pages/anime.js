const express = require("express")
const router = express.Router()
const AnimeApril = require('../../models/animeApril')
const AnimeBord = require('../../models/animebord')

function setLanguage(req, res, next) {
    const lang = req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน Header Accept-Language ให้เริ่มต้นเป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

router.get('/animeboard', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const AnimeBordData = await AnimeBord.find().populate('animeApril'); 
    const template = req.language === 'th' ? './component/pages/anime' : './en/anime';
    // console.log(AnimeBordData);

   
    res.render(template, { active: 'anime', usersesstion, AnimeBordData });
})

module.exports = router