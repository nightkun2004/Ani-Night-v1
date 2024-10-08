const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Video = require('../models/video')
const User = require('../models/user')
const Episodes = require("../models/Episodes")
const {addComent, getComent, getPlay, getEpisodes} = require('../controls/playerControle')

router.get('/play/:videoid', getPlay);
router.get('/get-episodes', getEpisodes);

// router.get('/play/:videoid/selectedEpisode/:episodeId', async (req, res) => {
//     try {
//         const usersesstion = req.session.userlogin;
//         const videoid = req.params.videoid;
//         const episodeId = req.params.episodeId;

//         const video = await Video.findOne({ videoid: videoid })
//             .populate('commentvideo episodes user author.id author username.id username replies')
//             .exec();

//         if (!video) {
//             console.log(`Video with id ${videoid} not found.`);
//             return res.render('404', { usersesstion });
//         }

//         const episodes = await Episodes.find({ video: video._id })
//             .populate('video')
//             .exec();

//         if (!episodes.length) {
//             console.log(`Episodes for video with id ${video._id} not found.`);
//             return res.render('404', { usersesstion });
//         }

//         let selectedEpisode = null;
//         if (episodeId) {
//             selectedEpisode = await Episodes.findOne({ _id: episodeId });
//             if (!selectedEpisode) {
//                 console.log(`Selected episode with id ${episodeId} not found.`);
//                 return res.render('404', { usersesstion });
//             }
//         }

//         await Video.findOneAndUpdate(
//             { videoid },
//             { $set: { watched: true }, $inc: { views: 1 } },
//             { new: true, upsert: false }
//         );

//         res.render('./component/play', {
//             active: 'actcile',
//             active: 'home',
//             usersesstion,
//             video,
//             episodes,
//             selectedEpisode,
//             rating: req.query.rating,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.post('/api/v2/add/comment', addComent)
router.get('/api/v2/get/comment', getComent)

router.post('/video/like', async (req, res) => { 
    const { videoId, commentId } = req.body;

    try {
        // Find the video by its ID
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Find the comment within the video's replies
        const comment = video.replies.find(reply => reply._id == commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Increment the likes count of the comment
        comment.likes += 1;

        // Save the updated video
        await video.save();

        res.status(200).json({ message: "Comment liked successfully", likes: comment.likes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint for reporting a video
router.post('/video/report', async (req, res) => {
    const { videoId } = req.body;

    try {
        // Find the video by its ID and mark it as reported
        const video = await Video.findByIdAndUpdate(videoId, { reported: true }, { new: true });

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video reported successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Video comments
router.post('/comment/post/video', async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const { video_id, inputcomment } = req.body;

        if (!video_id) {
            return res.status(400).json({ message: "VideoID หายไป" });
        }

        const newReply = {
            username: {
                id: usersesstion._id,
                username: usersesstion.username,
                profile: usersesstion.profile
            },
            content: inputcomment,
            createdAt: new Date()
        };

        // บันทึกความแบบอาร์เรใหม่ลงในฟิลด์ replies ของ Video
        await Video.findByIdAndUpdate(video_id, { $push: { replies: newReply } });

        res.status(201).json({ message: 'บันทึกความแบบอาร์เรสำเร็จ' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'ข้อผิดพลาดของเซิร์ฟเวอร์' });
    }
});

// router.get('/comments', async (req, res) => {
//     try {
//         const videoID = req.query;
//         const comments = await Video.find({videoID}).select('replies'); // ดึงเฉพาะฟิลด์ replies จากข้อมูล Video

//         res.json(comments); // ส่งความคิดเห็นกลับไปในรูปแบบ JSON
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

router.post('/play/:videoid/rate', async (req, res) => {
    const videoId = req.params.videoid;
    const { rating } = req.body;

    if (!req.session.userlogin) {
        // ถ้ายังไม่ได้เข้าสู่ระบบ ให้ redirect ไปยังหน้า login
        return res.redirect('/login');
    }

    try {
        const userId = req.session.userlogin._id;

        // ค้นหาผู้ใช้
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ตรวจสอบว่าผู้ใช้ให้คะแนนวิดีโอนี้ไปแล้วหรือไม่
        const video = await Video.findOne({ videoid: videoId });
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (video.ratedBy.includes(userId)) {
            return res.redirect(`/play/${videoId}?rating=คุณให้คะแนนแล้ว`);
        }

        // บันทึกการให้คะแนนลงในฐานข้อมูล
        video.ratings += parseInt(rating);

        // เพิ่ม userId เข้าไปในรายการ ratedBy
        video.ratedBy.push(userId);

        // บันทึกการเปลี่ยนแปลง
        await video.save();

        // ก่อนที่คุณจะใช้งาน push()
        if (!user.ratings) {
            user.ratings = [];
        }

        // จากนั้นคุณสามารถใช้ push() ได้
        user.ratings.push(videoId);
        await user.save();


        res.redirect(`/play/${videoId}?rating=สำเร็จแล้ว`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router