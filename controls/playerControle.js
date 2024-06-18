
const Video = require('../models/video')
const FloatingComment = require("../models/FloatingComment")

exports.addComent = async (req, res) => {
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
exports.getComent = async (req, res) => {
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