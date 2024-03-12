const express = require("express")
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const Video = require('../../../models/video')
const User = require('../../../models/user')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/videos');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// const storageSubtitle = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'src/public/subtitles'); // กำหนดโฟลเดอร์ที่จะบันทึกไฟล์
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname); // กำหนดชื่อไฟล์ที่จะถูกบันทึก
//     }
// });

// // Initialize multer
// const uploadSubtitle = multer({ storage: storageSubtitle });

const upload = multer({ storage: storage });

router.get('/upload_video', async (req, res) => {
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

router.post('/video-upload', upload.single('file_video'), async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const { namevideo, dec_video, tages, categories } = req.body;

        function generateRandomPostId() {
            let numbers = Array.from({ length: 5 }, (_, i) => i);
            shuffleArray(numbers);
            return numbers.join('');
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        let postId = generateRandomPostId();

        const tagsArray = tages.split('#').filter(tag => tag.trim() !== '').slice(0, 5);

        // เปลี่ยนไปตรงนี้
        const newFileName = generateRandomPostId();

        const newVideo = new Video({
            name: namevideo,
            description: dec_video,
            tags: tagsArray,
            categories: categories,
            filePath: newFileName,
            videoid: postId,
            username: usersesstion.username,
            profile: usersesstion.profile,
            published: req.body.published ? req.body.published : true,
            author: {
                id: usersesstion._id,
                username: usersesstion.username, 
                profile: usersesstion.profile
            },
        });

        // เพิ่มข้อมูลซับไตในโมเดล Video
        // newVideo.subtitles = {
        //     subthai: subthai || '', // ตั้งชื่อตามความเหมาะสม หรือเป็นค่าว่างหากไม่มีค่า
        //     subeng: subeng || '', // กำหนดชื่อซับไตภาษาอังกฤษ (ถ้ามี) หรือเป็นค่าว่างหากไม่มีค่า
        //     subjpan: subjpan || '', // กำหนดชื่อซับไตภาษาญี่ปุ่น (ถ้ามี) หรือเป็นค่าว่างหากไม่มีค่า
        // };


        await newVideo.save();
        await User.findByIdAndUpdate(usersesstion._id, { $push: { videos: newVideo._id } }, { new: true });

        const videoToken = jwt.sign({ videoId: newVideo._id }, '12345678900987654321', { expiresIn: '1h' });

        const oldFilePath = `src/public/videos/${req.file.filename}`;
        const newFilePath = `src/public/videos/${newFileName}.mp4`;
        fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
                console.error('Error renaming file:', err);
                return res.send('เกิดข้อผิดพลาดในการบันทึกวีดีโอ');
            }
            console.log('File renamed successfully');
        });
        res.redirect(`/successful?token=${videoToken}`);
    } catch (error) {
        console.error(error);
        res.send('เกิดข้อผิดพลาดในการบันทึกวีดีโอ');
    }
});


module.exports = router