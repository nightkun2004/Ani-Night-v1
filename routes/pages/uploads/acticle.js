const express = require("express")
const router = express.Router()
const Acticle = require("../../../models/acticle")
const User = require("../../../models/user")
const authenticatetoken = require('../../../middleware/authtoken')
const { verifyToken, verifyTokenAdmin } = require("../../../middleware/auth")
const {CreateArticle, UploadImagesArticle} = require("../../../controls/aticleCrollers")
const path = require('path')
const axios = require('axios');
const multer = require('multer')
const HttpError = require("../../../models/errorModel")
const crypto = require("crypto")
const fs = require("fs")
const dotenv = require('dotenv');
dotenv.config()

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
    storage: uploadActicle,
});

router.get('/upload_acticle', verifyToken, async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;

        if (!usersesstion) {
            return res.redirect('/login');
        }
        res.render('./component/pages/uploads/acticle', { active: 'upload_article', usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})
router.post('/upload/image/articles', UploadImagesArticle)
router.post('/upload/article', CreateArticle)

// router.post('/upload_acticle', upload.single('upload_picActicle'), async (req, res) => {
//     try {
//         const usersesstion = req.session.userlogin;
//         const { name, tags, content, username, categories } = req.body;
      
        
//         console.log('Categories:', categories);
        


//         function generateRandomPostId() {
//             let numbers = Array.from({ length: 5 }, (_, i) => i);
//             shuffleArray(numbers);
//             return numbers.join('');
//         }

//         function shuffleArray(array) {
//             for (let i = array.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [array[i], array[j]] = [array[j], array[i]];
//             }
//         }

//         let postId = generateRandomPostId();

//         if (!req.file) {
//             return res.status(400).send('No file uploaded.');
//         }


//         const postcreate = {
//             title: name,
//             content: content,
//             username: username,
//             categories: categories,
//             tags: Array.isArray(tags) ? tags : [tags],
//             photo: req.file.filename,
//             categories: Array.isArray(categories) ? categories : [categories],
//             link: req.body.link,
//             link_info: req.body.link_info,
//             url: postId,
//             iduser: req.body.iduser,
//             profile: usersesstion.profile,
//             published: req.body.published ? req.body.published : true,
//             author: {
//                 id: usersesstion._id,
//                 username: usersesstion.username,
//                 profile: usersesstion.profile
//             },
//             createdAt: req.body.createdAt ? new Date(req.body.createdAt) : Date.now()
//         };

//         const acticlesave = new Acticle(postcreate);
//         await acticlesave.save();
//         await User.findByIdAndUpdate(usersesstion._id, { $push: { acticles: acticlesave._id } }, { new: true });
//         res.status(200).redirect('/');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('เกิดข้อผิดกับโปรไฟล์');
//     }
// })

module.exports = router