const User = require('../models/user')

const isAdmin = async (req, res, next) => {
    const usersesstion = req.session.userlogin;
    try {
        if (usersesstion) {
            const user = await User.findOne({ userid: usersesstion.userid });
            if (user.approval_admin === true) {
                next();
            } else {
                res.status(403).send('ไม่อนุญาตให้เข้าถึง'); // ผู้ใช้ไม่มีสิทธิ์ ส่งสถานะ 403 Forbidden
            }
        } else {
            res.status(403).send('ไม่อนุญาตให้เข้าถึง'); // ไม่มีการล็อกอิน ส่งสถานะ 403 Forbidden
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์ผู้ใช้');
    }
};

module.exports = isAdmin;