const jwt = require('jsonwebtoken');

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

module.exports  = verifyToken;
