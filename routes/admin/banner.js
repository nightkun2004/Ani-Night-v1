const express = require("express")
const router = express.Router()
const Activity = require('../../models/Activity')
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const {verifyToken, verifyTokenAdmin} = require('../../middleware/auth')

router.get('/admin/add/banner', verifyToken, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/addBanner', {active: "banner",usersesstion});
});

router.post('/admin/add/notification', async (req, res) => {
    const { title, description, link, notification } = req.body;
    let imagePath = '';

    // แปลงค่า notification เป็น Boolean
    const isNotification = notification === 'on';

    if (req.files && req.files.image) {
        const image = req.files.image;
        const imageName = uuidv4() + path.extname(image.name);
        imagePath = imageName;
        let uploadPath = path.join(__dirname, '../..', 'src', 'public', 'notification', imageName);
        image.mv(uploadPath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
        });
    }

    const newActivity = new Activity({ title, description, link, notification: isNotification, imagePath });
    console.log(newActivity);
    await newActivity.save();
    res.redirect('/admin/add/banner');
});


router.get('/api/activities', async (req, res) => {
    const activities = await Activity.find().sort({createdAt: -1});
    res.json(activities);
});

module.exports = router