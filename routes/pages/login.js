const express = require("express")
const router = express.Router()
const userController = require('../../controls/userController')
// const ensureAuthenticated = require('../../middleware/login')
const authenticatetoken = require('../../middleware/authtoken')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

router.post('/api/googlelogin/user', async (req, res) => {
    const userData = req.body;
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
        // ถ้ามีผู้ใช้ที่มีอีเมลเดียวกันอยู่แล้วในฐานข้อมูล
        // สร้าง access token
        const accessToken = jwt.sign({ userId: existingUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });

        // ส่ง access token กลับไปยังผู้ใช้
        res.cookie('login-token', accessToken, { httpOnly: true, secure: true });

        // ส่งผลลัพธ์กลับไปยังผู้ใช้
        res.status(200).json({ message: 'User saved successfully' });
    } else {
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
        res.cookie('login-token', accessToken, { httpOnly: true, secure: true });

        const newUser = new User({
            Googleuid: userData.uid,
            name: userData.displayName,
            email: userData.email,
            googleprofile: userData.photoURL
        })

        await newUser.save();

        req.session.userlogin = {
            _id: newUser._id,
            Googleuid: newUser.Googleuid,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            profile: newUser.profile,
            googleprofile: newUser.googleprofile,
            bio: newUser.bio,
            videos: newUser.videos,
            acticles: newUser.acticles,
            posts: newUser.posts,
            createdAt: newUser.createdAt,
            followed: newUser.followed,
            url: newUser.url,
            followers: newUser.followers,
            youtube: newUser.youtube,
            tiktok: newUser.tiktok,
            facebook: newUser.facebook,
            accessToken: accessToken,
            alertMessage: req.query.alertMessage || ''
        };
        console.log(req.session.userlogin)
        res.status(200).json({ message: 'User saved successfully' });
    }
});

router.get('/login', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        // if (usersesstion) {
        //     return res.redirect(`/${usersesstion.url}?tokenlogin=${usersesstion.accessToken}&alertMessage=เข้าสุ่ระบบสำเร็จ`);
        // } else {

        // }
        const template = req.language === 'th' ? './component/pages/login' : './en/login';
        res.render(template, { active: 'login', usersesstion, alertMessage: req.query.alertMessage });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

router.get('/forgot', (req,res)=>{
    const usersesstion = req.session.userlogin;
    res.render('./component/pages/forgot', {usersesstion, active: 'home'})
})

router.post('/forgotemail', [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check if the email exists in the database
    const usersesstion = req.session.userlogin;
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'Email not found' });
    }
    res.render('./component/pages/Resetpassword', { email, usersesstion , active: 'home'});
});
router.post('/resetPassword', async (req, res) => { 
    const { email, password } = req.body;
    const usersesstion = req.session.userlogin;
    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
        user.password = hashedPassword;
        await user.save();

        // ส่งคืนการตอบกลับว่าเปลี่ยนรหัสผ่านสำเร็จ
        res.render('./component/pages/resetPasswordSuccess',{usersesstion, active: 'home'})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/api/login', userController.getAPIlogin);
router.post('/auth/login', userController.getLogin);
module.exports = router