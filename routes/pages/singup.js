const express = require("express")
const router = express.Router()
const userController = require('../../controls/userController');


function setLanguage(req, res, next) {
    const lang = req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน Header Accept-Language ให้เริ่มต้นเป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

router.get('/singup', (req, res) => {
    const alertMessage = req.query.alertMessage || null;
    const alertMessageerror = req.query.alertMessageerror || null; 
    const usersesstion = req.session.userlogin;
    const template = req.language === 'th' ? './component/pages/signup' : './en/signup';
    res.render(template, { active: 'singup', alertMessage, alertMessageerror, usersesstion }); 
})

router.post('/auth/singup', userController.getAllUser);
router.post('/api/v2/auth/signup', userController.getSignupAPI);
router.get('/api/v2/backup/users', userController.getUsersAll);

module.exports = router