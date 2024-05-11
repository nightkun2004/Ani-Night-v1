const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Acticle = require("../models/acticle")
const User = require('../models/user')
const comments = require('../models/comment')

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

router.get('/read', (req,res)=> {
    res.render('404')
})

router.get('/read/:url', async (req, res) => { 
    try {
        const usersesstion = req.session.userlogin;
        const url = req.params.url;

        if (!url) {
            return res.redirect('404');
        }
        
        const acticle = await Acticle.findOneAndUpdate( 
            { url: url },
            { $inc: { views: 1 } },
            { new: true, upsert: false }
        ).populate('author.id author comments').exec();
        const articleforyou = await Acticle.find().sort({ views: -1 }).limit(6).populate('author.id author'); 


        if (!acticle || !acticle.author || !acticle.author.id) {
            console.log('Article or Article user is undefined');
        }

        const template = req.language === 'th' ? './component/read' : './component/read';

        res.render(template, { 
            active: 'actcile',              
            active: 'home', 
            active: 'trending' ,
            usersesstion,
            acticle,
            articleforyou, 
            language: req.language 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

router.post('/follow/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUser = req.session.userlogin;

        // ตรวจสอบว่าผู้ใช้ลงชื่อเข้าใช้หรือไม่
        if (!currentUser) {
            return res.status(401).send('Unauthorized');
        }

        const userToFollow = await User.findById(userId);

        if (!userToFollow) {
            return res.status(404).send('User not found');
        }

        // ตรวจสอบว่าผู้ใช้ได้ทำการติดตามผู้ใช้นี้ก่อนหรือยัง
        if (userToFollow.followers.includes(currentUser._id)) {
            return res.status(400).send('Already followed');
        }

        // เพิ่มผู้ใช้ที่ติดตามไว้ในฐานข้อมูล
        userToFollow.followers.push(currentUser._id);
        await userToFollow.save();

        res.status(200).send('Followed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router