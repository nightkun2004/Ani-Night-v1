const express = require("express")
const router = express.Router()
const path = require('path')
const User = require('../../models/user')
const jwt = require('jsonwebtoken');
// const authenticatetoken = require('../../middleware/auth')
const authenticatetoken = require('../../middleware/authtoken')
const profileController = require("../../controls/profileController")
const { verifyToken, verifyTokenAdmin } = require("../../middleware/auth")
const { logoutAuth, authMiddleware } = require("../../middleware/authMainuser")
const crypto = require("crypto")
const fs = require("fs")
const HttpError = require("../../models/errorModel")

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

router.get('/profile', verifyTokenAdmin, profileController.getProfile)
// router.get('/:userID', verifyTokenAdmin, profileController.getUserID)
router.post('/playment', profileController.playment)
router.post('/auth/user/studio', profileController.getAuthUser)
router.post('/logout/user', logoutAuth, verifyTokenAdmin, profileController.logout)

// API Profile
router.get("/api/user/profile/v2/:id", profileController.getProfileApi)

router.post('/edit_profile', authMiddleware, async (req, res, next) => {
    try {
        const usersesstion = req.session.userlogin;
        const { username, name, url, bio } = req.body;
        const profileprofile = req.files ? req.files.profileprofile : null;

        const user = await User.findById(req.session.userlogin._id);

        // ตรวจสอบ URL
        if (url !== usersesstion.url) {
            const urlExists = await User.exists({ url });
            if (urlExists) {
                return res.status(400).send('URL นี้ถูกใช้แล้ว');
            }
        }

        // ตรวจสอบเวลาสำหรับการเปลี่ยนแปลง username
        const currentTime = new Date();
        const registrationTime = new Date(usersesstion.registrationTime);
        const timeDifference = currentTime - registrationTime;
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;

        if (timeDifference < sevenDaysInMillis) {
            return res.status(400).send('ไม่สามารถเปลี่ยนแปลง username ได้ น้อยกว่า 7 วัน');
        }

        // เตรียมข้อมูลที่ต้องการอัปเดต
        const updateData = {};
        if (username && username !== usersesstion.username) updateData.username = username;
        if (name && name !== usersesstion.name) updateData.name = name;
        if (url && url !== usersesstion.url) updateData.url = url;
        if (bio && bio !== usersesstion.bio) updateData.bio = bio;

        // ลบโปรไฟล์เก่าถ้ามี
        if (user.profile) {
            fs.unlink(path.join(__dirname, '../../', 'src/public/profiles', user.profile), (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }

        // อัปโหลดไฟล์โปรไฟล์ใหม่ถ้ามี
        if (profileprofile) {
            if (profileprofile.size > 5000000) {
                return next(new HttpError("รูปภาพของคุณมีขนาดใหญ่เกิน 5MB", 422));
            }

            let fileName = profileprofile.name;
            let splittedFilename = fileName.split('.');
            let newFilename = splittedFilename[0] + crypto.randomUUID() + "." + splittedFilename[splittedFilename.length - 1];
            const uploadPath = path.join(__dirname, '../../', 'src/public/profiles', newFilename);

            // ใช้ mv เพื่ออัปโหลดไฟล์
            await new Promise((resolve, reject) => {
                profileprofile.mv(uploadPath, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });

            updateData.profile = newFilename;
        }

        // อัปเดตข้อมูลในฐานข้อมูล
        const updatedProfile = await User.findByIdAndUpdate(req.session.userlogin._id, updateData, { new: true });

        if (!updatedProfile) {
            return next(new HttpError("ไม่สามารถอัปเดตโปรไฟล์ได้", 422));
        }

        // อัปเดตเซสชันของผู้ใช้เฉพาะข้อมูลที่เปลี่ยนแปลง
        req.session.userlogin = {
            ...req.session.userlogin,
            ...updateData,
            profile: updateData.profile || req.session.userlogin.profile // อัปเดต profile เฉพาะถ้ามีการเปลี่ยนแปลง
        };

        // console.log(req.session.userlogin)

        res.status(200).json({ message: 'โปรไฟล์ถูกอัปเดตแล้ว', redirect: `/profile?u=${updatedProfile.username}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขโปรไฟล์' });
    }
});

module.exports = router 