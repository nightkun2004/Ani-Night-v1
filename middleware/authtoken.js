const jwt = require('jsonwebtoken');
require('dotenv').config()

function authenticatetoken(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
        const token = authorizationHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT verification failed:", err);
                return res.status(403).json({ message: "Unauthorized. Invalid token." });
            }

            req.user = decoded;
            console.log("Token verified successfully:", decoded);
            next();
        });
    } else {
        console.error("No token provided in the Authorization header");
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
}

module.exports = authenticatetoken;