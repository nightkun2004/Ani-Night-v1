const express = require("express")
const router = express.Router()
const Activity = require('../../models/Activity')
const HttpError = require("../../models/errorModel")
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const {verifyToken, verifyTokenAdmin} = require('../../middleware/auth')

router.get('/admin/add/banner', verifyToken, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/addBanner', {active: "banner",usersesstion});
});

router.get("/admin/add/create/Activity", verifyToken ,async (req,res, next) =>{
    const usersesstion = req.session.userlogin;
    try {
        res.render("./admin/creates/Activity", {active: "Activity", usersesstion, query: req.query})
    } catch (error) {
        return next(new HttpError(error))
    }
})

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

router.post('/add/Activity/upload/html', async (req, res) => {
    const { title, description, cssCdn, jsCdn, linkurlparams } = req.body;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    const htmlFile = req.files.htmlFile;
    const htmlFileName = uuidv4() + '-' + htmlFile.name;
    const uploadPath = path.join(__dirname, '../..', 'src', 'public', 'uploads', htmlFileName);
  
    try {
      // อัปโหลดไฟล์ไปยังโฟลเดอร์ที่กำหนด
      htmlFile.mv(uploadPath, async (err) => {
        if (err) {
          return res.status(500).send(err);
        }
  
        const newActivity = new Activity({
          title,
          description,
          htmlFilePath: `/uploads/${htmlFileName}`,
          cssCdn,
          jsCdn,
          linkurlparams
        });
  
        await newActivity.save();
  
        res.redirect('/admin/add/create/Activity?success=true');
      });
    } catch (error) {
      console.error(error);
      res.redirect('/admin/add/create/Activity?error=true');
    }
  });

router.get('/api/activities', async (req, res) => {
    const activities = await Activity.find().sort({createdAt: -1});
    res.json(activities);
});

module.exports = router