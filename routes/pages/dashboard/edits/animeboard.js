const express = require("express")
const router = express.Router()
// const User = require('../../../../models/user')
// const AnimeApril = require('../../../../models/animeApril'); // เรียกใช้โมเดล AnimeApril
const AnimeBord = require('../../../../models/animebord');
const authenticatetoken = require('../../../../middleware/authtoken')

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

router.get('/:url/dashboard/animebord', authenticatetoken, async (req, res) => {
    const usersesstion = req.session.userlogin;
    const url = req.params.url;


    if (!usersesstion) {
        return res.redirect('/');
    }

    try {
        const userData = await AnimeBord.findOne({ _id: usersesstion._id, url: url })
            .populate('animeApril');

        // ตรวจสอบว่ามีบทความครบ 12 อันแล้วหรือไม่
        if (userData.animeApril.length >= 12) {
            // หากมี 12 อันขึ้นไปให้สร้างรายการใหม่
            const newPage = Math.ceil(userData.animeApril.length / ITEMS_PER_PAGE);
            return res.redirect(`/${url}/dashboard/animebord?page=${newPage}`);
        }

        res.render('./component/pages/dashboard/videos/animeboard', {
            usersesstion,
            userData,
            language: req.language,
        })
    } catch {

    }
})

module.exports = router