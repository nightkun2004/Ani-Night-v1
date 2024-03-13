
function ensureAuthenticated(req, res, next) {
    if (req.session.userlogin) {
        // ผู้ใช้เข้าสู่ระบบแล้ว สามารถเข้าถึงหน้าได้
        next();
    } else {
        // ผู้ใช้ยังไม่ได้เข้าสู่ระบบ ให้สิ้นสุด middleware ที่นี่โดยไม่มีการ redirect
        next('login');
    }
}


module.exports = ensureAuthenticated;