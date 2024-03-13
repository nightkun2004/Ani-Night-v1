const jwt = require('jsonwebtoken');
require('dotenv').config()

function verifyToken(req, res, next) {
    const token = req.cookies.a_e;

    if (!token) {
        return res.status(401).send('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
    }

    try {
        const decoded = jwt.verify(token, 'secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).send('Token is invalid or expired.');
    }
}


// exports.verifyToken_login = (req, res, next) => {
//     const token = req.params.tokenlogin; 
//     if (!token) return res.redirect('/login?alertMessage=กรุณาเข้าสู่ระบบ'); // ถ้าไม่มี token ให้เข้าสู่ระบบ

//     jwt.verify(token, 'login-token', (err, decoded) => { // ตรวจสอบ token
//         if (err) return res.redirect('/login?alertMessage=การยืนยันตัวตนล้มเหลว');
//         req.userId = decoded.userId; // ถ้า token ถูกต้อง กำหนด userId ให้กับ req object
//         next(); // ไปยัง middleware หรือ route ถัดไป
//     });
// };

module.exports  = verifyToken;
