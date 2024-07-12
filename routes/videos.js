const express = require("express")
const router = express.Router()
const crypto = require('crypto');
const mongoose = require("../config")
const Acticle = require("../models/acticle")
const Anishot = require("../models/Anishot")
const Video = require('../models/video')
// const setLanguage = require('../middleware/languageMiddleware');
const { getAnishots,
    getCreate,
    CreateAnishot,
    getAuthor,
    Likeanishot,
    putViewsAnishots,
    bookmarkanishot,
    datasAnishot,
    Commentanishot,
    getVideoShot,
    deleteComment } = require("../controls/AnishotsControllers")
const { authMiddleware } = require("../middleware/authMainuser")

const perPage = 20;

router.get('/news-pv', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const videos = await Video.find().populate('author.id');

        if (!Array.prototype.shuffle) {
            Array.prototype.shuffle = function () {
                let currentIndex = this.length, randomIndex, temporaryValue;

                while (currentIndex !== 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;

                    temporaryValue = this[currentIndex];
                    this[currentIndex] = this[randomIndex];
                    this[randomIndex] = temporaryValue;
                }

                return this;
            };
        }

        videos.shuffle();

        const totalVideo = videos.length;
        const totalPages = Math.ceil(totalVideo / perPage);
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const skip = (currentPage - 1) * perPage;
        const paginatedVideos = videos.slice(skip, skip + perPage);

        res.render('./component/videos/index', {
            active: 'foryou',
            usersesstion,
            videos,
            totalPages,
            paginatedVideos,
            currentPage
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

function generateToken() {
    return crypto.randomBytes(16).toString('hex');
}

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

function verifyToken(req, res, next) {
    const token = req.query.token; // รับ Token จาก Query Parameters
    const referer = req.get('Referer') || ''; // รับ Referer Header
    const allowedDomain = 'http://localhost:4000'; // โดเมนที่อนุญาต

    // ตรวจสอบว่า Referer ตรงตามโดเมนที่อนุญาต
    if (referer.startsWith(allowedDomain)) {
        // ตรวจสอบ Token (ใช้ Token ที่สร้างจากโดเมน)
        const expectedToken = generateToken(allowedDomain);
        if (token === expectedToken) {
            return next(); // Token และ Referer ถูกต้อง
        }
    }
    return res.status(403).json({ error: 'Forbidden' }); // Token หรือ Referer ไม่ถูกต้อง
}

router.get('/get-stream-url', (req, res) => {
    const token = generateToken();
    // Construct URL with token (you may want to include expiration time)
    const streamUrl = `https://live-aninight.ani-night.online/live/aninight/index.m3u8?token=${token}`;
    // console.log("token form get", token)
    // Send URL with token to the client
    res.json({ url: streamUrl, token: token });
});

router.get("/live/aninight", (req, res) => {
    const usersesstion = req.session.userlogin;
    const token = generateToken();
    const allowedCountry = 'th';
    const isRegionSupported = req.region === allowedCountry;
    // console.log("token form live", token)
    const streamUrl = `https://live-aninight.ani-night.online/live/aninight/index.m3u8?token=${token}`;
    res.render('./component/videos/live', {
        language: req.language,
        isRegionSupported: isRegionSupported,
        usersesstion,
        token,
        streamUrl,
    });
    // if (isRegionSupported) {
       
    // } else {
    //     // การแสดงข้อความในกรณีที่ภูมิภาคไม่รองรับ
    //     res.render('./en/videos/Live', {
    //         language: req.language,
    //         usersesstion,
    //         message: req.translations.video_not_available || 'This service is not available in your region.'
    //     });
    // }
})

router.get("/api/videos", async (req, res) => {
    try {
        const videos_data = await Video.find().exec();
        res.json(videos_data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.get('/anishots', getAnishots)
router.get('/anishot/video/:id', getVideoShot)
router.get('/api/v1/posts/users/:id', getAuthor);
router.get('/upload/create/anishot', getCreate)
router.get('/api/v2/posts/anishots', datasAnishot)
router.get('/api/v2/post/anishot/:id/comments', async (req, res, next) => {
    try {
        const anishot = await Anishot.findById(req.params.id).select('comments').populate('comments.username.id', 'username profile');
        if (!anishot) {
            return res.status(404).json({ message: 'Anishot not found' });
        }
        res.json({ comments: anishot.comments });
    } catch (error) {
        next(error);
    }
});
router.post('/api/v2/post/like/anishot/:id', authMiddleware, Likeanishot)
router.post('/api/v2/post/create/anishot', authMiddleware, CreateAnishot)
router.post('/api/v2/post/bookmark/anishot/:id', authMiddleware, bookmarkanishot)
router.post('/api/v2/post/comment/anishot/:id', authMiddleware, Commentanishot);
router.put('/api/v2/post/view/:id', putViewsAnishots)
router.delete('/api/v2/post/comment/anishot/:id/comment/:commentId', authMiddleware, deleteComment);

module.exports = router