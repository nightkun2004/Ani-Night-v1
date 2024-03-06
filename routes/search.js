const express = require("express")
const router = express.Router()
const Acticle = require('../models/acticle')

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

            if (articles.length > 0) {
                res.render('search', { active: 'home', usersesstion, articles, searchQuery });
            } else {
                res.render('search', { active: 'home', articles: [], searchQuery: 'ค้นหาเนื้อหาที่ต้องการ', usersesstion, message: 'ไม่พบการค้นหา' }); // เพิ่ม message ในกรณีไม่พบการค้นหา
            }
        } else {
            res.render('search', { active: 'home', articles: [], searchQuery: 'ค้นหาเนื้อหาที่ต้องการ', usersesstion });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error', error);
    }
})

module.exports = router