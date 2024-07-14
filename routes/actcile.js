const express = require("express");
const router = express.Router();
const Acticle = require("../models/acticle");

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
} 

router.use(setLanguage);

const ITEMS_PER_PAGE = 12;

router.get('/articles', async (req, res) => { 
    try { 
        const usersesstion = req.session.userlogin;
        const page = +req.query.page || 1; // หากไม่มีค่า page ให้เริ่มที่หน้าแรก
        const topViewedArticles = await Acticle.find().populate('author.id').sort({ createdAt: -1, views: -1 }).limit(5);
        const totalActicles = await Acticle.countDocuments();
        const acticles = await Acticle.find().
            populate('author.id')
            .skip((page - 1) * ITEMS_PER_PAGE) // ข้ามรายการตามหน้าที่
            .limit(ITEMS_PER_PAGE) // จำกัดจำนวนรายการที่ดึง
            .lean() 
            .sort({createdAt: -1,})
            .exec();

      const template = req.language === 'th' ? './component/acticle.ejs' : './en/article';

        res.render(template, {
            active: 'article',
            usersesstion,
            acticles,
            topViewedArticles,
            language: req.language,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalActicles, // ตรวจสอบว่ามีหน้าถัดไปหรือไม่
            hasPrevPage: page > 1, // ตรวจสอบว่ามีหน้าก่อนหน้าหรือไม่
            nextPage: page + 1, // หน้าถัดไป
            prevPage: page - 1, // หน้าก่อนหน้า
            lastPage: Math.ceil(totalActicles / ITEMS_PER_PAGE) // หน้าสุดท้าย
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
});

router.get('/acticle/api', async (req, res) => {
    try {
        const acticles = await Acticle.find().sort({ createdAt: -1 }).exec();
        res.json(acticles)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
});


module.exports = router;
