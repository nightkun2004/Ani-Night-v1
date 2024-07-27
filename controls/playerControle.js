const Episodes = require("../models/Episodes")
const Video = require('../models/video')
const FloatingComment = require("../models/FloatingComment")
const HttpError = require('../models/errorModel');


const getPlay = async (req, res, next) => {
    try {
        const usersesstion = req.session.userlogin;
        const videoid = req.params.videoid;

        const video = await Video.findOne({ _id: videoid })
            .populate('commentvideo episodes user author.id author username.id username replies')
            .exec();

        if (!video) {
            console.log(`Video with id ${videoid} not found.`);
            return res.render('404', { usersesstion });
        }

        await Video.findOneAndUpdate(
            { videoid },
            { $set: { watched: true }, $inc: { views: 1 } },
            { new: true, upsert: false }
        );

        res.render('./component/play', {
            active: 'actcile',
            active: 'home',
            usersesstion,
            video,
            rating: req.query.rating,
        });
    } catch (err) {
        next(new HttpError(err), 500)
    }
}

const getEpisodes = async (req, res, next) => {
    const videoid = req.query.videoid;
    const epNumber = req.query.ep;

    try {
        if (!epNumber) {
            return res.status(404).json({ message: "ไม่พบจำนวนตอน" });
        }

        const episodes = await Episodes.find({ video: videoid, ep: epNumber })
            .populate('video')
            .exec();

        if (episodes.length === 0) {
            return res.status(404).json({ message: "ไม่พบจำนวนตอน" });
        }

        res.json(episodes);
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}



const addComent = async (req, res) => {
    const { content, time, videoId } = req.body;
    try {

        const newComment = new FloatingComment({
            content,
            time,
            videoId
        })
        await newComment.save();
        console.log(newComment)
        res.status(200).json({ message: 'ความคิดเห็นถูกบันทึกเรียบร้อยแล้ว' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกความคิดเห็น' });
    }
}


const getComent = async (req, res) => {
    const { videoId, time } = req.query;

    // ตรวจสอบว่าพารามิเตอร์ videoId และ time มีค่า
    if (!videoId || !time) {
        return res.status(400).json({ message: 'พารามิเตอร์ videoId หรือ time ไม่ถูกต้อง' });
    }

    try {
        // ตรวจสอบว่า time เป็นตัวเลข
        const parsedTime = parseFloat(time);
        if (isNaN(parsedTime)) {
            throw new Error('Time ต้องเป็นตัวเลข');
        }

        const comments = await FloatingComment.find({
            videoId,
            time: { $gte: parsedTime - 0.5, $lte: parsedTime + 0.5 }
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error); // แสดงข้อผิดพลาดในคอนโซลเซิร์ฟเวอร์
        res.status(500).json({ message: `เกิดข้อผิดพลาดในการดึงความคิดเห็น: ${error.message}` }); // ส่งข้อผิดพลาดไปยังไคลเอ็นต์
    }
}


module.exports = {
    addComent,
    getComent
    , getPlay,
    getEpisodes
}