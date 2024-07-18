const express = require('express')
const router = express.Router()
const editActicle = require('../controls/editController')
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/cover_videos');
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extension);
    }
});

const upload = multer({ storage });

router.get('/edit_video/editsubthai', (req,res) => {
   const usersesstion = req.session.userlogin;
   res.render('./component/pages/edits/videos/subthai', {usersesstion, active: 'dashboard'})
}) 

router.get('/add/banner', editActicle.editBannerGet)
router.get('/delete/:id', editActicle.Delete)
router.get('/delete/video/:id', editActicle.DeleteVideo)
router.post('/edit_video/cover', editActicle.editVideo_cover)

router.post('/edit_acticle', editActicle.editActicle)
router.post('/edit_acticle/cover', editActicle.editActicleCover)
// router.post('/edit_video/cover', editActicle.editVideo_cover)
router.post('/edit_video', editActicle.editVideo)
router.post('/cover/videothum',upload.single('firecovervideo'), editActicle.video_saveCover)
router.post('/edit/article/user', editActicle.editActicleuser)
router.post('/edit_acticle/cover', editActicle.editActicleCover)
router.post('/edit/article/new', editActicle.editActicleCovernow)
router.post('/edit/video/user', editActicle.editVideouser)

// API Edit
router.get("/api/v2/edit/article/:id", editActicle.editApiaricle)

module.exports = router