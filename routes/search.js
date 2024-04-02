const express = require("express")
const router = express.Router()
const Acticle = require('../models/acticle')

function setLanguage(req, res, next) {
    const lang = req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน Header Accept-Language ให้เริ่มต้นเป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}
 
router.use(setLanguage);

router.get('/search', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const searchQuery = req.query.query; // รับคำค้นหาจาก query string
        if (searchQuery) {
            const articles = await Acticle.find({
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } }, 
                    { content: { $regex: searchQuery, $options: 'i' } }
                ]
            }).populate('author.id').exec();

            const template = req.language === 'th' ? './search' : './en/search';

            if (articles.length > 0) {
                res.render(template, { active: 'home', usersesstion, articles, searchQuery, language: req.language }); 
            } else {
                res.render(template, { active: 'home', articles: [], searchQuery: 'ค้นหาเนื้อหาที่ต้องการ', language: req.language, usersesstion, message: 'ไม่พบการค้นหา' }); // เพิ่ม message ในกรณีไม่พบการค้นหา
            }
        } else {
            const template3 = req.language === 'th' ? './search' : './en/search';
            res.render(template3, { active: 'home', articles: [], searchQuery: 'ค้นหาเนื้อหาที่ต้องการ', usersesstion, language: req.language, });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error', error);
    }
})

module.exports = router