const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
        const token = authorizationHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return next(new HttpError("Unauthorized. Invalid token.", 403));
            }

            req.user = decoded;
            next();
        });
    } else {
        return next(new HttpError("Unauthorized. No token provided.", 401));
    }
};

const logoutAuth = (req, res, next) => {
    if (req.session && req.session.userlogin && req.session.userlogin.isAdmin) {
        return next();
    } else {
        res.redirect('/');
    }
};


module.exports = {authMiddleware, logoutAuth};
