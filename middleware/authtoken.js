const jwt = require('jsonwebtoken');
require('dotenv').config()

function authenticatetoken(req, res, next) {
    const accessToken = req.query.tokenlogin; 
    if (!accessToken) return res.redirect('/login?alertMessage=กรุณาเข้าสู่ระบบ'); // ถ้าไม่มี token ให้เข้าสู่ระบบ

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => { // ตรวจสอบ token
        if (err) return res.redirect('/login?alertMessage=การยืนยันตัวตนล้มเหลว');
        req.userId = decoded.userId; // ถ้า token ถูกต้อง กำหนด userId ให้กับ req object
        next(); // ไปยัง middleware หรือ route ถัดไป
    });
}

module.exports = authenticatetoken;