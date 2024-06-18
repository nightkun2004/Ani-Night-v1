const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const accessToken = req.cookies['login-token'];

    if (!accessToken) {
        req.session.returnTo = req.originalUrl;
        req.alertMessage = 'กรุณาเข้าสู่ระบบ';
        return res.status(401).render('login', { alertMessage: req.alertMessage });
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            req.session.returnTo = req.originalUrl;
            req.alertMessage = 'การยืนยันตัวตนล้มเหลว';
            return res.status(401).render('login', { alertMessage: req.alertMessage });
        }
        req.userId = decoded.userId;
        next();
    });
}

function verifyTokenAdmin(req, res, next) {
    const accessToken = req.cookies['login-token'];  // Correct way to access the cookie

    if (!accessToken) {
        req.session.returnTo = req.originalUrl;
        req.alertMessage = 'กรุณาเข้าสู่ระบบ';
        return res.status(401).render('login', { alertMessage: req.alertMessage });
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            req.session.returnTo = req.originalUrl;
            req.alertMessage = 'การยืนยันตัวตนล้มเหลว';
            return res.status(401).render('login', { alertMessage: req.alertMessage });
        }
        req.userId = decoded.userId;
        next();
    });
}

module.exports = { verifyToken, verifyTokenAdmin };
