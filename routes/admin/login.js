const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');

router.get('/admin/login', (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/login', { usersesstion });
});

router.post('/admin/login', (req, res) => {
    const username = req.body.username; 
    const password = req.body.password; 

    if (username === 'admin' && password === 'nightkun_04') {
        const token = jwt.sign({ username: username }, 'secret_key', { expiresIn: '10m' });
        res.cookie('a_e', token, { httpOnly: true, secure: true }); 

        res.send('ยินดีต้อนรับเข้าสู่ระบบแอดมิน');
    } else {
        res.send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
});

router.get('/admin/logout', (req, res) => {
    res.clearCookie('jwt');
    res.clearCookie('a_e');
    res.send('คุกกี้ token ถูกล้างแล้ว');
});


module.exports = router