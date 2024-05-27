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
    const usersesstion = req.session.userlogin;
    try {
        const tagname = req.params.tagname;
        let tags_se;
        if (tagname && tagname !== 'ทั้งหมด') {
            tags_se = await Acticle.find({ tags: tagname }).populate('author');
        } else {
            tags_se = await Acticle.find().populate('author');
        }
        res.render("./component/tags/index", { activemenu: 'tags', usersesstion, tagname, tags_se });
    } catch (err) {
        console.log(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์');
    }
});

module.exports = router