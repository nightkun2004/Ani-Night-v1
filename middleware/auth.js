const jwt = require('jsonwebtoken');
require('dotenv').config()

function verifyToken(req, res, next) {
    const accessToken = req.query.tokenlogin;

    if (!accessToken) return res.redirect('/login?alertMessage=กรุณาเข้าสู่ระบบ');

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.redirect('/login?alertMessage=การยืนยันตัวตนล้มเหลว');
        req.userId = decoded.userId;
        next();
    });
}
module.exports  = verifyToken;
