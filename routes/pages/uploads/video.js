const express = require("express")
const router = express.Router();
const { verifyToken, verifyTokenAdmin } = require('../../../middleware/auth')
const { processVideo } = require("../../../controls/uploadcontroller")
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const jwt = require('jsonwebtoken');
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const Video = require('../../../models/video')
const User = require('../../../models/user')
require("dotenv").config()

router.get('/upload_video', verifyTokenAdmin, async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        if (!usersesstion) {
            return res.redirect('login')
        }
        res.render('./component/pages/uploads/video.ejs', { active: 'videos', usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})
router.get('/successful', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        res.render('./component/pages/uploads/successful.ejs', { active: 'successful', usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

router.post('/upload/video/main', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const { namevideo, dec_video, tags, categories } = req.body;
        const videoFile = req.files.file_video;
        // console.log(videoFile)
        if (!videoFile) {
            return res.status(404).json({ massage: "คุณไม่ได้เลือกวีดีโอ" })
        }

        let postId = crypto.randomUUID();
        // console.log(postId)
        // อัปโหลดวีดีโอ
        let videoFilename = `${crypto.randomUUID()}.mp4`;
        let videoUploadPath = path.join(__dirname, '../../../', 'src', 'public', 'videos', videoFilename);
        await videoFile.mv(videoUploadPath);
        // console.log(videoFilename)

        const processedFiles = await processVideo(videoUploadPath);

        const newVideo = new Video({
            name: namevideo,
            description: dec_video,
            tags: Array.isArray(tags) ? tags : [tags],
            categories: categories,
            filePath: videoFilename,
            filequality144p: processedFiles['144p'] ? path.basename(processedFiles['144p']) : '',
            filequality240p: processedFiles['240p'] ? path.basename(processedFiles['240p']) : '',
            filequality360p: processedFiles['360p'] ? path.basename(processedFiles['360p']) : '',
            filequality480p: processedFiles['480p'] ? path.basename(processedFiles['480p']) : '',
            filequality720p: processedFiles['720p'] ? path.basename(processedFiles['720p']) : '',
            videoid: postId,
            published: req.body.published ? req.body.published : true,
            author: {
                id: usersesstion._id,
                username: usersesstion.username, 
                profile: usersesstion.profile
            },
        });

        await newVideo.save();
        console.log(newVideo)
        await User.findByIdAndUpdate(usersesstion._id, { $push: { videos: newVideo._id } }, { new: true });

        const videoToken = jwt.sign({ videoId: newVideo._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.redirect(`/successful?token=${videoToken}`);
        
    } catch (error) {
        console.error(error);
        res.send('เกิดข้อผิดพลาดในการบันทึกวีดีโอ');
    }
});


module.exports = router