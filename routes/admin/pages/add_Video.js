const express = require('express')
const router = express.Router();
const Video = require("../../../models/video")
const Episodes = require("../../../models/Episodes")
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/Episodes');
    },
    filename: function (req, file, cb) {
        cb(null,`videofile-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const ITEMS_PER_PAGE = 12;

router.get("/admin/add/ep", async (req, res) => {
    const usersesstion = req.session.userlogin;
    const page = +req.query.page || 1;
    try {
        const videos = await Video.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        res.render("./admin/pages/add_Video", {
            usersesstion,
            active: 'Addep',
            videos,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < videos,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1, 
            lastPage: Math.ceil(videos / ITEMS_PER_PAGE)
        })
    } catch (err) {
        console.log(err)
    }
})

router.get("/admin/add/ep/:id", async (req, res) => {
    const usersesstion = req.session.userlogin;
    const videoid = req.params.id
    try {
        const video = await Video.findById(videoid)
        console.log(video)
        res.render("./admin/edits/addVideoEp", {
            video,
            active: 'Addep',
            usersesstion})
    } catch (err) {
        console.log(err)
    }
})

router.post("/admin/add/ep/to/:id", upload.single('videoFile'), async (req, res) => {
    const { name, description, ep, publicationStartTime, expirationDate } = req.body;
    const videoid = req.params.id;
    try {
        const video = await Video.findById(videoid);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const fileName = req.file.filename;

        // แก้ไขชื่อและคำอธิบายของวิดีโอ
        video.name = name;
        video.description = description;

        // สร้างตอนใหม่ในคอลเลคชั่น Episodes
        const newEpisode = new Episodes({
            video: videoid,
            ep: ep,
            fire: [fileName],
            publicationStartTime: new Date(publicationStartTime),
            expirationDate: expirationDate ? new Date(expirationDate) : null
        });

        await newEpisode.save();

        // เพิ่มไอดีของตอนใหม่ในฟิลด์ Episodes ของวิดีโอ
        video.episodes.push(newEpisode._id);
        await video.save();

        console.log("แก้ไขชื่อและคำอธิบาย", video);
        console.log("เพิ่มตอน", newEpisode);

        res.redirect(`/admin/add/ep/${videoid}`);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router