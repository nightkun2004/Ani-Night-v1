const Acticle = require('../models/acticle')
const Video = require('../models/video')
const crypto = require("crypto")
const fs = require('fs');
const path =require('path')

exports.editActicle = async (req, res) => {
    const usersesstion = req.session.userlogin
    const edit_id = req.body.edit_id
    try {
        const article = await Acticle.findOne({ _id: edit_id }).exec();
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        res.render('./component/pages/edits/edit_acticle', { active: 'edit_article', article, usersesstion })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.editActicleCover = async (req, res) => {
    const usersesstion = req.session.userlogin
    const edit_id = req.body.edit_id
    try {
        const article = await Acticle.findOne({ _id: edit_id }).exec();
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }

        res.render('./component/pages/edits/editActicleCover', { active: 'editActicleCover', article, usersesstion })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.editVideo = async (req, res) => {
    const usersesstion = req.session.userlogin
    const edit_id = req.body.edit_id
    try {
        const video = await Video.findOne({ _id: edit_id }).exec();
        if (!video) {
            return res.status(404).json({ error: "Vidoe not found" });
        }

        res.render('./component/pages/edits/edit_video', { active: 'dashboard', video, usersesstion })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.editVideo_cover = async (req, res) => {
    const usersesstion = req.session.userlogin
    const edit_id = req.body.edit_id
    try {
        const video = await Video.findOne({ _id: edit_id }).exec();
        if (!video) {
            return res.status(404).json({ error: "Vidoe not found" });
        }

        res.render('./component/pages/edits/videos/edit_cover', { active: 'dashboard', video, usersesstion })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.video_saveCover = async (req, res) => {
    const coverthum_id = req.body.coverthum_id;

    try {
        const video = await Video.findOne({ _id: coverthum_id });
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        // ตรวจสอบว่ามีไฟล์อัพโหลดหรือไม่
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // อัปเดตข้อมูลในฐานข้อมูล
        video.coverImage = req.file.filename;
        await video.save();

        res.redirect('/?alertMessageVideo=เพิ่มซับไทยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.editActicleuser = async (req, res) => {
    const update_id = req.body.update_id;

    try {
        const { title, content, tags, url, categories, published } = req.body;
        let updates = {
            title,
            content,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            categories: categories ? categories.split(',').map(category => category.trim()) : [],
            published: req.body.published === 'on',
            url
        };


        // Handle additional images
        // if (req.files['images']) {
        //     const images = req.files['images'];
        //     const oldImages = JSON.parse(req.body.oldImages || '[]');

        //     // Delete old images
        //     oldImages.forEach(imagePath => {
        //         if (fs.existsSync(path.join(__dirname, '..', 'public', 'ArticlesImages_mord', path.basename(imagePath)))) {
        //             fs.unlinkSync(path.join(__dirname, '..', 'public', 'ArticlesImages_mord', path.basename(imagePath)));
        //         }
        //     });

        //     // Save new images
        //     const newImages = images.map(image => {
        //         const newImageName = crypto.randomUUID() + path.extname(image.originalname);
        //         fs.renameSync(image.path, path.join(__dirname, '..', 'public', 'ArticlesImages_mord', newImageName));
        //         return `/articles_images/${newImageName}`;
        //     });

        //     updates.images = newImages;
        // }

        await Acticle.findByIdAndUpdate(update_id, updates);
        res.redirect('/?alertMessage=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
exports.editActicleCovernow = async (req, res) => {
    const update_id = req.body.update_id;
    try {
        const acticle = await Acticle.findOne({ _id: update_id });
        if (!acticle) {
            return res.status(404).json({ error: "acticle not found" });
        }

        // ตรวจสอบว่ามีไฟล์อัพโหลดหรือไม่
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        

        // อัปเดตข้อมูลในฐานข้อมูล
        acticle.photo = req.file.filename;
        await acticle.save();

        res.redirect('/?alertMessage=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


exports.editVideouser = async (req, res) => {
    const update_id = req.body.update_id;
    try {
        await Video.findOneAndUpdate(
            { _id: update_id },
            {
                $push: { acticles: update_id },
                name: req.body.namevideo,
                description: req.body.dec_video,
                categories: req.body.categories,
            }
        );

        res.redirect('/?alertMessageVideo=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.Delete = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const imageToDelete = await Acticle.findById(req.params.id);

        if (!imageToDelete) {
            return res.status(404).send('Video not found');
        }

        const filePath = `/acticles_images/${imageToDelete.filePath}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Acticle.findByIdAndDelete(req.params.id, { useFindAndModify: false });
        res.redirect(`/${usersesstion.url}/dashboard?tokenlogin=${usersesstion.accessToken}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.DeleteVideo = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const VidoeToDelete = await Video.findById(req.params.id);

        if (!VidoeToDelete) {
            return res.status(404).send('Video not found');
        }

        const filePath = `/videos/${VidoeToDelete.filePath}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Video.findByIdAndDelete(req.params.id, { useFindAndModify: false });
        res.redirect(`/${usersesstion.url}/dashboard/video?tokenlogin=${usersesstion.accessToken}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

// Edit Videos
