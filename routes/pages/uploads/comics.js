const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CreateComic, EditComic, AddEpcomic, CreateComicMain, ComicList } = require('../../../controls/Comiccontroller');
const {verifyToken ,verifyTokenAdmin}= require('../../../middleware/auth');

const storagePoster = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/posters/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const storagePage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/comics/'); // Define the folder to save the files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Create a unique suffix
        const fileExtension = file.originalname.split('.').pop(); // Get the file extension
        const uniqueFilename = `${uniqueSuffix}.${fileExtension}`; // Create a unique filename
        cb(null, uniqueFilename);
    }
});

const uploadComicpage = multer({ storage: storagePage }).array('comicFile', 50);

const postercomic = multer({ storage: storagePoster }); 

router.get("/admin/create/comic", CreateComic)
router.get("/admin/ComicList/All", ComicList)
router.get("/admin/Edit/chapter", EditComic)
router.post("/admin/comic/uploads/ep", verifyTokenAdmin, uploadComicpage, AddEpcomic)
router.post("/create/comic", postercomic.single('postercommic'), CreateComicMain)

module.exports = router; 