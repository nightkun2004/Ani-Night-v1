const express = require("express")
const router = express.Router()
const AnimeApril = require('../../models/animeApril')
const AnimeBord = require('../../models/animebord');
const Acticle = require("../../models/acticle");

function setLanguage(req, res, next) {
    const lang = req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน Header Accept-Language ให้เริ่มต้นเป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

async function loadAnimeData(req, res, next) {
    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril'); 
        req.AnimeBordData = AnimeBordData;
        next();
    } catch (error) {
        next(error);
    }
}

router.get('/categories', async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const category = req.query.category;
        let posts;
        if (category && category !== 'ทั้งหมด') {
            posts = await Acticle.find({ categories: category }).populate('author');
        } else {
            posts = await Acticle.find().populate('author');
        }
        res.render("./component/pages/categories", { active: 'categories', usersesstion, posts });
    } catch (err) {
        console.log(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์');
    }
})

// router.get('/animeboard:april', async (req,res)=>{
//     const query_april = req.query.april; 
//     const usersesstion = req.session.userlogin;
// })

router.get('/explore/categories', async (req, res) => {
    try {
        const category = req.query.category;
        let posts;
        if (category && category !== 'ทั้งหมด') {
            posts = await Acticle.find({ categories: category }).populate('author');
        } else {
            posts = await Acticle.find().populate('author');
        }
        res.json(posts); // Ensure JSON response
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์' }); // Send JSON error
    }
});

module.exports = router