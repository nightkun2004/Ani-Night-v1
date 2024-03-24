const express = require("express")
const router = express.Router()
const userController = require('../../controls/userController')
// const ensureAuthenticated = require('../../middleware/login')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
},
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            if (!profile || !profile.id) {
                return done(new Error('Invalid profile data'));
            }

            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                const newUser = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
                });
                await newUser.save();
                user = newUser;
            } else {
                // มีผู้ใช้ในระบบอยู่แล้ว ให้ทำการเข้าสู่ระบบโดยไม่ต้องสร้างบัญชีใหม่
                req.session.userlogin = user;
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // ตรวจสอบว่าการยืนยันตัวตนผ่าน Google OAuth สำเร็จแล้ว
        if (req.user) {
            const userlogin = req.user; // รับข้อมูลผู้ใช้จาก Passport.js
            const accessToken = jwt.sign({ userlogin: userlogin._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
            res.cookie('login-token', accessToken, { httpOnly: true, secure: true });
            req.session.userlogin = {
                _id: userlogin._id,
                name: userlogin.name,
                username: userlogin.username,
                email: userlogin.email,
                password: userlogin.password,
                profile: userlogin.profile,
                bio: userlogin.bio,
                videos: userlogin.videos,
                acticles: userlogin.acticles,
                posts: userlogin.posts,
                createdAt: userlogin.createdAt,
                followed: userlogin.followed,
                url: userlogin.url,
                followers: userlogin.followers,
                youtube: userlogin.youtube,
                tiktok: userlogin.tiktok,
                facebook: userlogin.facebook, 
                accessToken: accessToken,
                alertMessage: req.query.alertMessage
            };
            res.redirect(`/${userlogin.url}?tokenlogin=${accessToken}&alertMessage=เข้าสุ่ระบบสำเร็จ`);
        } else {
            // กรณีไม่สามารถยืนยันตัวตนผ่าน Google OAuth ได้
            res.redirect('/login'); // ลิงก์ไปยังหน้าเข้าสู่ระบบอีกครั้งหรือหน้าที่เหมาะสม
        }
    }
);

router.get('/login', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const template = req.language === 'th' ? './component/pages/login' : './en/login';
        res.render(template, { active: 'login', usersesstion, alertMessage: req.query.alertMessage });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

router.post('/login', userController.getLogin);
module.exports = router