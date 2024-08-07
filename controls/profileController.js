const User = require("../models/user")
const Acticle = require("../models/acticle")
const Payment = require('../models/playment')
const axios = require('axios');
const HttpError = require("../models/errorModel")
// const authenticatetoken = require('../middleware/auth')
// const jwt = require('jsonwebtoken')

exports.getProfile = async (req, res, next) => {
    try {
        const username = req.query.u;
        const usersesstion = req.session.userlogin;
        // console.log("userID Profile", usersesstion);

        if (!usersesstion) {
            return res.redirect("/")
        }
        const userData = await User.findOne({ _id: usersesstion, username: username })
            .populate('acticles');

        if (!userData) {
            return next(new HttpError("เกิดข้อผิดพลาดกับ userData"), 404)
        }

        res.render('./component/pages/profile', { active: 'profile', usersesstion, userData, alertMessage: req.query.alertMessage });

    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาดกับโปรไฟล์');
    }
}
exports.getArticlesUser = async (req, res, next) => {
    try {
        const userID = req.params.id;
        // console.log("userID Profile", usersesstion);
        const userData = await User.findOne({ _id: userID })
            .populate('acticles');

        if (!userData) {
            return next(new HttpError("เกิดข้อผิดพลาดกับ userData"), 404)
        }

        res.status(200).json(userData)
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาดกับโปรไฟล์');
    }
}

exports.getProfileApi = async (req, res) => {
    try {
        const userID = req.params.id;
        console.log(`Received userID: ${userID}`); 

        const userData = await User.findOne({ _id: userID })
            .populate('acticles');

            // console.log(`Found userData: ${userData}`); 

        res.json(userData);

    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดกับโปรไฟล์');
    }
}

exports.playment = async (req, res) => {
    try {
        const { name, truemoney } = req.body;
        const payment = await Payment.create({ name, truemoney });

        if (req.session.userlogin) {
            const userId = req.session.userlogin._id;

            // อัปเดตข้อมูลการชำระเงินในโมเดล User
            await User.findByIdAndUpdate(userId, { payment: payment._id });

            // ส่งคำขอสำเร็จกลับไป
            res.redirect(`/dashboard/${req.session.userlogin.url}`)
        } else {
            // ถ้าไม่มีการล็อกอิน ส่งข้อผิดพลาดกลับไป
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        // หากมีข้อผิดพลาดในการบันทึกข้อมูล ส่งข้อความข้อผิดพลาดกลับไป
        console.error(error);
        res.status(500).send('Error saving payment');
    }
}

exports.getAuthUser = async (req, res) => {
    try {
        const userData = req.body; // รับข้อมูลผู้ใช้จาก body ของคำขอ POST

        // ส่งข้อมูลผู้ใช้ไปยังเซิร์ฟเวอร์ของ Studio ผ่านการส่งคำขอ POST ด้วย Axios
        const response = await axios.post('http://localhost:5173/api/auth/user', userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // ตรวจสอบว่าการส่งข้อมูลสำเร็จหรือไม่
        if (response.status === 200) {
            // ส่งข้อมูลผู้ใช้ไปยังเซิร์ฟเวอร์เรียบร้อยแล้ว
            res.status(200).send('User data sent to studio server successfully');
        } else {
            // ไม่สามารถส่งข้อมูลผู้ใช้ไปยังเซิร์ฟเวอร์ได้
            res.status(500).send('Failed to send user data to studio server');
        }
    } catch (error) {
        // มีข้อผิดพลาดเกิดขึ้นในขณะส่งข้อมูลผู้ใช้
        console.error('Error sending user data to studio server:', error);
        res.status(500).send('An error occurred while sending user data to studio server');
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('เกิดข้อผิดพลาดในการออกจากระบบ');
        }
        res.redirect('/'); // รีไดเรคไปที่หน้าแรกหลังจากออกจากระบบ
    });
};
