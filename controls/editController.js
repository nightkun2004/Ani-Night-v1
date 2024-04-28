const Acticle = require('../models/acticle')
const Video = require('../models/video')
const fs = require('fs');

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

exports.editActicleuser = async (req, res) => {
    const update_id = req.body.update_id; 
    try {
        await Acticle.findOneAndUpdate(
            { _id: update_id },
            {
                $push: { acticles: update_id },
                title: req.body.title,
                content: req.body.content,
                link_info: req.body.link_info,
                categories: req.body.categories,
                url: req.body.url 
            }
        );

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