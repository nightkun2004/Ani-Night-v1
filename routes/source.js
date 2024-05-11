const express = require("express")
const router = express.Router()
const Acticle = require('../models/acticle')

function setLanguage(req, res, next) {
    const lang = req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน Header Accept-Language ให้เริ่มต้นเป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

router.get('/sources', async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const template = req.language === 'th' ? 'source' : './en/source'; 
        res.render(template, { active: 'rules', usersesstion})
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router