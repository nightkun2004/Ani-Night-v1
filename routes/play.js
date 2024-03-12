const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Video = require('../models/video')

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
            foryouVideo: shuffledVideos
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

module.exports = router