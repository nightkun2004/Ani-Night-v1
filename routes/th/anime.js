const express = require("express");
const router = express.Router();

// Middleware to set language based on 'accept-language' header
function setLanguage(req, res, next) {
    const lang = req.headers['accept-language'] || 'en';
    req.language = lang && lang.includes('th') ? 'th' : 'en';
    next();
}

router.use(setLanguage);

module.exports = router;
