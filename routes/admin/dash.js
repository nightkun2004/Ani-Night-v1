const express = require('express')
const router = express.Router()
const verifyToken = require('../../middleware/auth')
const User = require('../../models/user')

router.get('/admin/dash', verifyToken, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.render('./admin/dash', { userCount }); // ส่งข้อมูลผู้ใช้ไปยังหน้าจอ dash โดยใช้ EJS
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
    }
});

router.get('/admin/update_code', verifyToken, (req, res) => {
    res.render('./admin/updateReward');
});

router.get('/admin/update_link', verifyToken, (req, res) => {
    res.render('./admin/updatelink');
});

router.get('/success', (req, res) => {
    res.render('success')
})

module.exports = router