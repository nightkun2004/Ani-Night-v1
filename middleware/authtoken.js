const jwt = require('jsonwebtoken');
require('dotenv').config()

function authenticatetoken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.redirect('/login?alertMessage=กรุณาเข้าสู่ระบบ');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.redirect('/login?alertMessage=การยืนยันตัวตนล้มเหลว');
        req.userId = decoded.userId;
        next();
    });
}

module.exports = authenticatetoken;