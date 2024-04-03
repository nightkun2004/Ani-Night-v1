const express = require('express');
const router = express.Router();

// สร้าง middleware สำหรับการตรวจสอบคุ้กกี้และสร้างคุ้กกี้ใหม่หากไม่มี
router.use((req, res, next) => {
    if (!req.cookies.cookieConsent) {
        // หากยังไม่มีคุ้กกี้ยินยอม สร้างป็อปอัพคุ้กกี้
        res.cookie('cookieConsent', 'true', { maxAge: 900000, httpOnly: true });
        // แสดงป็อปอัพคุ้กกี้ทุกครั้งที่เรียกหน้าใหม่
        res.locals.showPopup = true;
    } else {
        // ถ้ามีคุ้กกี้ยินยอมแล้ว ไม่ต้องแสดงป็อปอัพคุ้กกี้
        res.locals.showPopup = false;
    }
    next();
});

module.exports = router;
