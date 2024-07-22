const express = require("express");
const router = express.Router();
const path = require('path')
// const AdmZip = require('adm-zip');
const archiver = require('archiver');
const fs = require('fs');
const Acticle = require('../models/acticle');
const AnimeBord = require('../models/animebord')
const Video = require('../models/video')
const cookie = require('../middleware/cookie')

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);
router.use(cookie);

const ITEMS_PER_PAGE = 12;

router.get('/', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const alertMessage = req.query.alertMessage || null;
    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril animeMay animeJune animeJuly').sort({ createdAt: -1 });
        const acticles = await Acticle.find().exec();
        const videos = await Video.find().sort({ createdAt: -1 }).limit(6);
        const topViewedArticles = await Acticle.find().populate('author.id').sort({ views: -1 }).limit(5);
        const acticlefotYou = await Acticle.find().populate('author.id').sort({ views: -1 }).limit(5);
        const updatedArticles = await Acticle.find().populate('author.id').sort({ updatedAt: -1 }).limit(3);
        const page = +req.query.page || 1; // หากไม่มีค่า page ให้เริ่มที่หน้าแรก 
        const totalActicles = await Acticle.countDocuments();
        const acticles_Bors = await Acticle.find().
            populate('author.id')
            .skip((page - 1) * ITEMS_PER_PAGE) // ข้ามรายการตามหน้าที่
            .limit(ITEMS_PER_PAGE) // จำกัดจำนวนรายการที่ดึง
            .lean()
            .sort({ createdAt: -1 })
            .limit(10)
            .exec();


        const template = req.language === 'th' ? 'index' : './en/index';


        res.render(template, {
            active: 'home',
            usersesstion,
            acticles,
            alertMessage,
            topViewedArticles, 
            acticlefotYou,
            updatedArticles,
            videos,
            language: req.language,
            translations: req.translations ,
            AnimeBordData,
            acticles_Bors,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalActicles, // ตรวจสอบว่ามีหน้าถัดไปหรือไม่
            hasPrevPage: page > 1, // ตรวจสอบว่ามีหน้าก่อนหน้าหรือไม่
            nextPage: page + 1, // หน้าถัดไป
            prevPage: page - 1, // หน้าก่อนหน้า
            lastPage: Math.ceil(totalActicles / ITEMS_PER_PAGE),
            alertMessageVideo: req.query.alertMessageVideo
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/ads.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '../google/ads.txt'));
});
router.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '../google/robots.txt'));
});

router.get('/privacy', (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('privacy', { active: 'privacy', usersesstion })
})

router.get('/backup-admin/server', (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('backups', { active: 'privacy', usersesstion })
})

function checkFolderAndFiles(folderName) {
    const folderPath = path.join(__dirname, 'src/public/articles_images', folderName); // แก้เป็น articles_images
    if (!fs.existsSync(folderPath)) {
        throw new Error(`โฟลเดอร์ "${folderName}" ไม่พบ`);
    }

    const files = fs.readdirSync(folderPath);
    if (files.length === 0) {
        throw new Error(`โฟลเดอร์ "${folderName}" ว่างเปล่า`);
    }
}

// ตั้งค่าตัวเลือกการบีบอัด
const options = {
    level: 3,
    name: 'data.zip',
};

// โหลดไฟล์ zip
router.post('backups/:folderName', async (req, res) => {
    const folderName = req.params.folderName;

    try {
        checkFolderAndFiles(folderName);

        const zipName = `${folderName}_${options.name}`;
        const output = fs.createWriteStream(zipName);
        const archive = archiver('zip');

        archive.on('error', (err) => {
            console.error(err);
            res.status(500).send('เกิดข้อผิดพลาดระหว่างการบีบอัด');
        });

        archive.pipe(output);
        archive.directory(path.join(__dirname, 'src/public', 'articles_images', folderName), true); // แก้เป็น articles_images
        archive.finalize();

        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            res.download(zipName);
        });
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});


// router.get('/download/:fileName', async (req, res) => {
//     const fileName = req.params.fileName;
//     const filePath = path.join(__dirname, 'public', fileName);
  
//     try {
//       if (!fs.existsSync(filePath)) {
//         throw new Error(`ไฟล์ "${fileName}" ไม่พบ`);
//       }
  
//       const fileData = fs.readFileSync(filePath);
//       const mimeType = getMimeType(fileName);
  
//       res.setHeader('Content-Type', mimeType);
//       res.send(fileData);
//     } catch (err) {
//       console.error(err);
//       res.status(404).send(err.message);
//     }
//   });

//   function getMimeType(fileName) {
//     switch (fileName.split('.').pop().toLowerCase()) {
//       case 'jpg':
//         return 'image/jpeg';
//       case 'png':
//         return 'image/png';
//       case 'mp4':
//         return 'video/mp4';
//       default:
//         return 'application/octet-stream';
//     }
//   }

router.get('/download/images', (req, res) => {
    // สร้างไฟล์ zip
    const zipName = 'data.zip';
    const output = fs.createWriteStream(zipName);
    const archive = archiver('zip');

    output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        res.download(zipName); // ส่งไฟล์ zip กลับไปยังผู้ใช้
    });

    archive.on('error', (err) => {
        throw err;
    });

    // เพิ่มไฟล์จากโฟลเดอร์ images และ videos
    archive.pipe(output);
    archive.directory(path.join(__dirname, 'images'), 'images');
    archive.finalize();
});

module.exports = router;