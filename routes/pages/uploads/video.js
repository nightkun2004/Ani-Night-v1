const express = require("express")
const router = express.Router();
const { verifyToken, verifyTokenAdmin } = require('../../../middleware/auth')
const multer = require('multer');
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

        const newVideo = new Video({
            name: namevideo,
            description: dec_video,
            tags: Array.isArray(tags) ? tags : [tags],
            categories: categories,
            filePath: videoFilename,
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

        // const oldFilePath = `src/public/videos/${req.file.filename}`; 
        // const newFilePath = `src/public/videos/${newFileName}.mp4`;
        // fs.rename(oldFilePath, newFilePath, (err) => {
        //     if (err) {
        //         console.error('Error renaming file:', err);
        //         return res.send('เกิดข้อผิดพลาดในการบันทึกวีดีโอ');
        //     }
        //     console.log('File renamed successfully');
        // });
        
    } catch (error) {
        console.error(error);
        res.send('เกิดข้อผิดพลาดในการบันทึกวีดีโอ');
    }
});


module.exports = router