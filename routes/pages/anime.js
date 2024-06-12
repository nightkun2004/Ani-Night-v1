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

async function loadAnimeData(req, res, next) {
    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril'); 
        req.AnimeBordData = AnimeBordData;
        next();
    } catch (error) {
        next(error);
    }
}

router.get('/anime/th-TH/foryou', (req, res) => {
    const usersesstion = req.session.userlogin;
    const template = req.language === 'th' ? './component/th/anime' : './component/th/anime'; 
   
    res.render(template, { active: 'anime-th', usersesstion});
})

router.get('/animeboard', loadAnimeData, async (req, res) => {
    const query = req.query.search; 
    const usersesstion = req.session.userlogin;
    const AnimeBordData = await AnimeBord.find().populate('animeApril animeMay animeJune animeJuly').sort({ createdAt: -1 }); 
    const template = req.language === 'th' ? './component/pages/anime' : './component/pages/anime'; 
   
    res.render(template, { active: 'anime', usersesstion, AnimeBordData, seq: { query: query }});
})

router.get('/animeboard/search', async (req, res) => {
    const query = req.query.search; 
    try {
        const allAnimeData = await AnimeBord.find().populate('animeApril animeMay animeJune animeJuly');
        res.json(allAnimeData); // ส่งข้อมูลทั้งหมดของอนิเมะกลับไปเป็น JSON response
    } catch (error) {
        console.error("Error fetching anime data:", error);
        res.status(500).json({ error: "An error occurred while fetching anime data" }); // จัดการข้อผิดพลาด
    }
});


module.exports = router