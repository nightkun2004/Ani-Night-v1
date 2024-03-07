const express = require("express")
const router = express.Router()
const Acticle = require("../../../models/acticle")

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
} 

router.use(setLanguage);


router.get('/tag/:tagname', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const tagname = req.params.tagname;
        const articlesWithTag = await Acticle.find({ tags: tagname }).exec();

        res.render('./component/tags/index', {active: 'home', articlesWithTag, language: req.language, tagname, usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

module.exports = router