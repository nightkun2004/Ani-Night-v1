const express = require("express")
const router = express.Router()
const mongoose = require("../../../config")
const Reward = require("../../../models/code")
const User = require("../../../models/user")
const videos = require('../videos/router')
const authenticatetoken = require("../../../middleware/authtoken")
 
router.get('/:url/video', authenticatetoken, async (req, res) => {
    try {
        const url = req.params.url;
        const usersesstion = req.session.userlogin;
        const userData = await User.findOne({ url: url })
            .populate('videos');
        if (!usersesstion) {
            return res.redirect('/') 
        }
        res.render('./component/pages/profile/video', { active: 'profile', usersesstion, userData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

router.get('/:url/reward', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        if (!usersesstion) {
            return res.redirect('/')
        }
        res.render('./component/pages/profile/Reward', { active: 'profile', usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

router.post('/reward', function (req, res) {
    const rewardCode = req.body.reward_code;
    const usersesstion = req.session.userlogin;

    // ใช้ Promises แทน callback
    Reward.findOne({ code: rewardCode })
        .then(foundReward => {
            if (foundReward) {
                // หากพบรหัสในฐานข้อมูล
                res.render('success');
            } else {
                // หากไม่พบรหัสในฐานข้อมูล
                res.send('รหัสโค้ดไม่ถูกต้อง');
            }
        })
        .catch(err => {
            // จัดการข้อผิดพลาดในการค้นหาในฐานข้อมูล
            console.log(err);
            res.send("พบข้อผิดพลาดในการตรวจสอบรหัส");
        });
}); 

router.get('/:url/live', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        if (!usersesstion) {
            return res.redirect('/')
        }
        res.render('./component/pages/profile/live', { active: 'profile', usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

router.use(videos)

module.exports = router