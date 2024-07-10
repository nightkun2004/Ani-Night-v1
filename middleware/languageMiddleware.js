const fs = require('fs');
const path = require('path');
const geoip = require('geoip-lite'); // ใช้สำหรับตรวจสอบภูมิภาคจาก IP

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en';
    const supportedLanguages = ['th', 'en', 'jp', 'ko', 'zh'];
    const language = supportedLanguages.includes(lang) ? lang : 'en'; // ใช้ภาษาเป็นค่าเริ่มต้นหากไม่รองรับ
    req.language = language;

    // จำลองการตั้งค่าภูมิภาคจาก IP
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    req.region = geo ? geo.country : 'US'; // ใช้ประเทศเป็นค่าที่ค้นพบจาก IP

    const translationsPath = path.join(__dirname, '../src/locales', `${req.language}.json`);

    if (fs.existsSync(translationsPath)) {
        try {
            const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
            res.locals.translations = translations;
            req.translations = translations; // ตั้งค่า req.translations
        } catch (err) {
            console.error(`Error parsing language file: ${err}`);
            res.locals.translations = {};
            req.translations = {}; // ตั้งค่า req.translations ให้เป็นอ็อบเจกต์ว่าง
        }
    } else {
        console.error(`Language file not found: ${translationsPath}`);
        res.locals.translations = {};
        req.translations = {}; // ตั้งค่า req.translations ให้เป็นอ็อบเจกต์ว่าง
    }

    next();
}

module.exports = setLanguage;
