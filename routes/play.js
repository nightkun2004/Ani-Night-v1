const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Video = require('../models/video')
const User = require('../models/user')

router.get('/play/:videoid', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const videoid = req.params.videoid;

        const video = await Video.findOneAndUpdate(
            { videoid: videoid },
            { $inc: { views: 1 } },
            { new: true, upsert: false }
        ).populate('commentvideo user author.id author').exec();

        let isPolicy = null;

        if (!video) {
            return res.render('404')
        }

        if (!video.watched) {
            await Video.findOneAndUpdate(
                { videoid },
                { $set: { watched: true }, $inc: { views: 1 } },
                { new: true, upsert: false }
            );
        }

        if (!Array.prototype.shuffle) {
            Array.prototype.shuffle = function () {
                let currentIndex = this.length, randomIndex, temporaryValue;

                // ใช้วิธี Fisher-Yates shuffle algorithm
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

        const videos = await Video.find();
        const allVideos = await Video.find().sort({ views: -1 });

        // สุ่มลำดับของวิดีโอ
        const shuffledVideos = allVideos.slice().shuffle().slice(0, 10);


        res.render('./component/play', {
            active: 'actcile',
            active: 'home',
            usersesstion,
            video,
            videos,
            isPolicy,
            foryouVideo: shuffledVideos,
            rating: req.query.rating
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

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