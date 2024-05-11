const express = require("express");
const router = express.Router();
const path = require('path')
const Acticle = require('../models/acticle');
const AnimeBord = require('../models/animebord')
const Video = require('../models/video')
const cookie = require('../middleware/cookie')

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}  

router.use(setLanguage); 
router.use(cookie);

const ITEMS_PER_PAGE = 12;

router.get('/', async (req, res) => { 
    const usersesstion = req.session.userlogin;
    const alertMessage = req.query.alertMessage || null;
    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril animeMay animeJuly').sort({ createdAt: -1 }); 
        const acticles = await Acticle.find().exec();
        const videos = await Video.find().sort({createdAt: -1}).limit(6);
        const topViewedArticles = await Acticle.find().populate('author.id').sort({ createdAt: -1, views: -1 }).limit(5);
        const acticlefotYou = await Acticle.find().populate('author.id').sort({ views: -1 }).limit(10);
        const page = +req.query.page || 1; // หากไม่มีค่า page ให้เริ่มที่หน้าแรก 
        const totalActicles = await Acticle.countDocuments();
        const acticles_Bors = await Acticle.find().
            populate('author.id')
            .skip((page - 1) * ITEMS_PER_PAGE) // ข้ามรายการตามหน้าที่
            .limit(ITEMS_PER_PAGE) // จำกัดจำนวนรายการที่ดึง
            .lean()
            .sort({createdAt: -1})
            .limit(10)
            .exec();


        const template = req.language === 'th' ? 'index' : 'index';


        res.render(template, {
            active: 'home',
            usersesstion,
            acticles,
            alertMessage,
            topViewedArticles,
            acticlefotYou,
            videos,
            language: req.language,
            AnimeBordData,
            acticles_Bors,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalActicles, // ตรวจสอบว่ามีหน้าถัดไปหรือไม่
            hasPrevPage: page > 1, // ตรวจสอบว่ามีหน้าก่อนหน้าหรือไม่
            nextPage: page + 1, // หน้าถัดไป
            prevPage: page - 1, // หน้าก่อนหน้า
            lastPage: Math.ceil(totalActicles / ITEMS_PER_PAGE),
            alertMessageVideo: req.query.alertMessageVideo
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/ads.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '../google/ads.txt'));
 });
router.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '../google/robots.txt'));
 });

 router.get('/privacy', (req,res)=> {
    const usersesstion = req.session.userlogin;
    res.render('privacy', {active: 'privacy',usersesstion})
 })

module.exports = router;