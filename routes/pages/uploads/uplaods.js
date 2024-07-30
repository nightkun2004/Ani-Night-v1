const express = require("express")
const router = express.Router()
const uploadActicle = require('../uploads/acticle')
const tags = require('../../../routes/pages/tags/tags')
const video_upload = require('../../../routes/pages/uploads/video')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

router.get('/face/id', (req,res)=>{
    const usersesstion = req.session.userlogin;
    res.render("./component/faceid", {usersesstion})
})

const uploadFolder = 'src/public/faces';
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

router.post('/upload/face/id', (req, res) => {
    if (!req.files || !req.files.photo) {
        return res.status(400).send('ไม่มีไฟล์อัพโหลด');
    }

    const photo = req.files.photo;
    const ext = path.extname(photo.name); // รับนามสกุลไฟล์
    const newFilename = `${uuidv4()}${ext}`; // ใช้ UUID เป็นชื่อไฟล์

    photo.mv(path.join(uploadFolder, newFilename), (err) => {
        if (err) {
            return res.status(500).send('เกิดข้อผิดพลาดในการอัพโหลด');
        }
        res.send(`ไฟล์ ${newFilename} ถูกอัพโหลดสำเร็จ`);
    });
});

router.use(uploadActicle)
router.use(tags)
router.use(video_upload)

module.exports = router