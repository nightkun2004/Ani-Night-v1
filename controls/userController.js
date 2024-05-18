const User = require("../models/user")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config()

exports.getAllUser = async (req, res) => { 
    const Userdata = ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password 
    })
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Userdata.password, saltRounds);

        function generateRandomPostId() {
            let numbers = Array.from({ length: 8 }, (_, i) => i); 
            shuffleArray(numbers);
            return numbers.join('');
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        let userid = generateRandomPostId();

        const Usersave = new User({
            username: Userdata.username,
            email: Userdata.email,
            password: hashedPassword,
            userid: userid
        });
        await Usersave.save();
        return res.redirect('/login?alertMessagesuccess=สมัครสมาชิกสำเร็จแล้วว ! เข้าสู่ระบบได้');
    } catch (err) {
        console.error(err);
        return res.redirect('/singup?alertMessageerror=อาจจะเป็นเพราะอีเมลซํ้าก็ได้ .!');
    }
};

exports.getLogin = async (req, res) => { 
    try {
        const { email, password } = req.body;
        const userlogin = await User.findOne({ email }) 

        if(!userlogin) {
            return res.redirect('/login?alertMessage=เราไม่พบชื่อผู้ใช้');
        }


        const isPasswordValid = await bcrypt.compare(password, userlogin.password);

        if(!isPasswordValid) {
            return res.redirect('/login?alertMessage=รหัสผ่านไม่ถูกต้อง');
        }

        const accessToken = jwt.sign({ userlogin: userlogin._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
        res.cookie('login-token', accessToken, { httpOnly: true, secure: true });

        req.session.userlogin = {
            _id: userlogin._id,
            uid: userlogin.uid,
            name: userlogin.name,
            username: userlogin.username,
            email: userlogin.email,
            password: userlogin.password,
            profile: userlogin.profile,
            points: userlogin.points,
            truemoney: userlogin.truemoney,
            googleprofile: userlogin.googleprofile,
            bio: userlogin.bio,
            videos: userlogin.videos,
            acticles: userlogin.acticles,
            posts: userlogin.posts,
            createdAt: userlogin.createdAt,
            followed: userlogin.followed, // ผูัติดตามทั้งหมด
            url: userlogin.url,
            followers: userlogin.followers, // ผู้ติดตาม
            youtube: userlogin.youtube,
            tiktok: userlogin.tiktok,
            facebook: userlogin.facebook, 
            accessToken: accessToken,
            alertMessage: req.query.alertMessage,
            userid: userlogin.userid,
            approval_admin: true
        };
        res.redirect(`/${userlogin.url}?tokenlogin=${accessToken}&alertMessage=เข้าสุ่ระบบสำเร็จ`);
    } catch(error) {
        console.log(error)
        return res.redirect('/login?alertMessage=เกิดข้อผิดพลาด');
    }
};

exports.getAPIlogin = async (req, res) => { 
    try {
        const { email, password } = req.body;
        const userlogin = await User.findOne({ email }) 

        if(!userlogin) {
            return res.status(400).json({ success: false, message: 'เราไม่พบชื่อผู้ใช้' });
        }

        const isPasswordValid = await bcrypt.compare(password, userlogin.password);

        if(!isPasswordValid) { 
            return res.status(400).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        const accessToken = jwt.sign({ userlogin: userlogin._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
        res.cookie('login-token', accessToken, { httpOnly: true, secure: true });

        req.session.userlogin = {
            _id: userlogin._id,
            uid: userlogin.uid,
            name: userlogin.name,
            username: userlogin.username,
            email: userlogin.email,
            password: userlogin.password,
            profile: userlogin.profile,
            points: userlogin.points,
            truemoney: userlogin.truemoney,
            googleprofile: userlogin.googleprofile,
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
            alertMessage: req.query.alertMessage,
            userid: userlogin.userid,
            approval_admin: true
        };

        return res.status(200).json({ success: true, message: 'เข้าสุ่ระบบสำเร็จ', accessToken: accessToken, userlogin: req.session.userlogin });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
};



// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log(secretKey);