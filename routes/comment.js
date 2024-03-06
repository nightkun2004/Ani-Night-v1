const express = require('express')
const router = express.Router()
const comments = require('../models/comment')
const Acticle = require('../models/acticle');

router.post('/comment/:articleId', async (req, res) => {
    const { content } = req.body;
    const articleId = req.params.articleId;
    const usersesstion = req.session.userlogin;

    try {
        // ตรวจสอบข้อมูล session และ articleId
        if (!articleId) {
            return res.status(400).send('Article ID is required');
        }
        if (!usersesstion) { 
            return res.status(400).send('User session is required');
        }
    
        // สร้างคอมเมนต์
        const comment = await comments.create({
            content,
            author: {
                id: usersesstion._id,
                username: usersesstion.username,
                profile: usersesstion.profile
            },
            article: articleId
        });
    
        // ตรวจสอบว่า comment ถูกสร้างขึ้นแล้ว
        if (!comment) {
            return res.status(500).send('Failed to create comment');
        }
    
        // อัพเดต article ในฐานข้อมูลเพื่อเพิ่ม comment ลงไป
        await Acticle.findByIdAndUpdate(articleId, { $push: { comments: comment._id } }, { new: true });
    
        // Redirect หรือทำอะไรต่อที่นี่
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating comment');
    }    
});


module.exports = router