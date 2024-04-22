const express = require('express');
const router = express.Router();

// Middleware สำหรับการตรวจสอบคุ้กกี้และสร้างคุ้กกี้ใหม่หากไม่มี
router.use((req, res, next) => {
    if (!req.cookies.cookie) {
        res.cookie('cookie', 'false', { expiresIn: '5m', httpOnly: true });
        res.locals.showPopup = true;
    } else {
        // ถ้ามีคุกกี้แล้ว และคุกกี้เป็น true (ยินยอม) หรือ false (ไม่ยินยอม) ไม่ต้องแสดง Popup อีก
        if (req.cookies.cookie === 'true' || req.cookies.cookie === 'false') {
            res.locals.showPopup = false;
        } else {
            // ถ้ามีคุกกี้แล้ว แต่ค่าคุกกี้ไม่ได้อยู่ในรูปแบบที่ถูกต้อง ให้แสดง Popup
            res.locals.showPopup = true;
        }
    }
    next();
});


router.post('/cookie-response', (req, res) => {
    const accept = req.body.accept;
    console.log("Cookie response:", accept ? "Accepted" : "Rejected");
    
    // ส่งตอบกลับแสดงว่าบันทึกข้อมูลสำเร็จ
    res.sendStatus(200); // ทำการส่งตอบกลับที่นี่
    
    // หากตอบกลับว่ายินยอม ให้ซ่อน Popup คุกกี้
    if (accept) {
        res.cookie('cookie', 'true', { expiresIn: '5m', httpOnly: true });
        return; // หยุดการทำงานของ middleware หรือ route ที่นี่
    }
});



module.exports = router;
