const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Acticle = require("../models/acticle")
const Anishot = require("../models/Anishot")
const Video = require('../models/video')
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

router.get('/foryou', async (req, res) => {
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