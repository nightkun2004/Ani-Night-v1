const Acticle = require("../models/acticle")
const User = require("../models/user")
const path = require('path')
const multer = require('multer')

const uploadActicle = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/acticles_images')
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extension);
    }
});

const upload = multer({
    storage: uploadActicle
});

exports.getUploadActicle = upload.single('upload_picActicle'),  async (req,res) => {
    
}