const express = require("express")
const router = express.Router()
const multer = require('multer')
const path = require('path')
const User = require('../../models/user')
const jwt = require('jsonwebtoken');
const profileController = require("../../controls/profileController")

function generateToken(user) {
    // กำหนดข้อมูลใน Payload
    const payload = {
        userId: user.id,
        username: user.username, 
        readingStartTime: new Date().getTime(), // เวลาเริ่มต้นอ่านข่าว
        readingEndTime: new Date().getTime() + (60 * 1000) // เวลาสิ้นสุดอ่านข่าว (เพิ่ม 60 วินาที)
        // เพิ่มข้อมูลเพิ่มเติมตามที่ต้องการ
    };

    // สร้าง JWT โดยใช้ข้อมูล Payload และคีย์ลับ
    const token = jwt.sign(payload, 'secretKey', { expiresIn: '1h' });

    return token;
}

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
} 

router.use(setLanguage);



const uploadprofile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/profiles')
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extension);
    }
});

const upload = multer({ 
    storage: uploadprofile
});

router.get('/:url', profileController.getProfile) 
router.post('/playment', profileController.playment)
router.get('/logout/:id', profileController.logOut)

router.post('/edit_profile', upload.single('profileprofile'), async (req,res) => {
    try {
        const usersesstion = req.session.userlogin
        const { username, name, url, bio } = req.body;
        const profileprofile = req.file;

        if (url !== usersesstion.url) {
            const urlExists = await User.exists({ url });
            if (urlExists) {
                return res.status(400).send('URL นี้ถูกใช้แล้ว');
            }
        }

        const currentTime = new Date();
        const registrationTime = new Date(usersesstion.registrationTime);
        const timeDifference = currentTime - registrationTime;
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;

        if (timeDifference < sevenDaysInMillis) {
            return res.status(400).send('ไม่สามารถเปลี่ยนแปลง username ได้ น้อยกว่า 7 วัน');
        }

        usersesstion.username = username; 
        usersesstion.name = name;
        usersesstion.url = url;
        usersesstion.bio = bio;

        if (profileprofile) {
            usersesstion.profile = profileprofile.filename;
        }

        await User.findByIdAndUpdate(usersesstion._id, {
            username: usersesstion.username,
            name: usersesstion.name,
            profile: usersesstion.profile,
            url: usersesstion.url,
            bio: usersesstion.bio,
        });

        res.redirect(`${usersesstion.url}`);
    } catch (error) {
        console.error(error);
        res.send('เกิดข้อผิดพลาดในการแก้ไขโปรไฟล์');
    }
})

module.exports = router 