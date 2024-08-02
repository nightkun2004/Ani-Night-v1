const express = require("express")
const router = express.Router()
const Acticle = require('../../../../../models/acticle')
const User = require('../../../../../models/user')
const Video = require('../../../../../models/video')
const authenticatetoken = require('../../../../../middleware/authtoken')
const {authMiddlewareUser} = require("../../../../../middleware/authMainuser")

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);


router.get('/:url/dashboard/video', authMiddlewareUser, async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const url = req.params.url;

        if (!usersesstion) {
            return res.redirect('/');
        }

        // ดึงข้อมูลผู้ใช้และบทความทั้งหมดของผู้ใช้
        const userData = await User.findOne({ _id: usersesstion._id, url: url })
            .populate('videos');

        res.render('./component/pages/dashboard/videos/index', {
            active: 'edit_video',
            usersesstion,
            userData,
            language: req.language,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router