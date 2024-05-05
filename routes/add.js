const express = require("express");
const router = express.Router();
const Video = require('../models/video')
const Add = require('../controls/addController')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/subtitles');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/add_subthai', Add.Addsubthai)
router.post('/add_ottplatforms', Add.AddOTT)
router.post('/save_ott', Add.addLinkPathform)
router.post('/add/subthai',  upload.single('file_sub'), async (req,res) => {
    const sub_id = req.body.sub_id;
    try {
        await Video.findOneAndUpdate(
            { _id: sub_id },
            { $set: { subthai: req.file.filename } },
            { upsert: true }
        );

        res.redirect('/?alertMessageVideo=เพิ่มซับไทยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


module.exports = router