const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const accessToken = req.cookies['login-token']; 

    if (!accessToken) return res.redirect('/login?alertMessage=กรุณาเข้าสู่ระบบ');

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.redirect('/login?alertMessage=การยืนยันตัวตนล้มเหลว');
        req.userId = decoded.userId;
        next();
    });
}

function verifyTokenAdmin(req, res, next) {
    const accessToken = req.cookies['login-token'];  // Correct way to access the cookie

    if (!accessToken) return res.redirect('/login?alertMessage=กรุณาเข้าสู่ระบบ');

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.redirect('/login?alertMessage=การยืนยันตัวตนล้มเหลว');
        req.userId = decoded.userId;
        next();
    });
}

module.exports = { verifyToken, verifyTokenAdmin };
