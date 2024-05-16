const User = require("../models/user")
const Acticle = require("../models/acticle")
const Payment = require('../models/playment')
const axios = require('axios');
// const authenticatetoken = require('../middleware/auth')
// const jwt = require('jsonwebtoken')


exports.getProfile = async (req, res) => {
    try {
        const url = req.params.url;
        const usersesstion = req.session.userlogin;

        if (!usersesstion) {
            return res.redirect('/');
        }

        if (usersesstion.url !== url) {
            return res.redirect('/');
        }

        const userData = await User.findOne({ _id: usersesstion._id, url: url })
            .populate('acticles');

        // const userHistory = await History.find({ user: usersesstion._id })
        //     .sort({ createdAt: -1 })
        //     .populate('article');

        res.render('./component/pages/profile', { active: 'profile', usersesstion, userData, alertMessage: req.query.alertMessage });

    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดกับโปรไฟล์');
    }
}

exports.getUserID = async (req, res) => {
    try {
        const Users = await User.find

        res.send(userData);
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดกับโปรไฟล์');
    }
}

exports.playment = async (req,res) => {
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




exports.logOut = async (req, res) => {
    try {
        if (req.session.userlogin) {
            if (req.params.id === req.session.userlogin._id.toString()) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }

                    res.clearCookie('login-token'); 
                    return res.redirect('/');
                });
            } else {
                return res.status(403).send('Forbidden');
            }
        } else {
            return res.status(403).send('Forbidden');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}