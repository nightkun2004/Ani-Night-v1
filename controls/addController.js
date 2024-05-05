const Video = require('../models/video');

exports.Addsubthai = async (req, res) => {
    const usersesstion = req.session.userlogin
    const edit_id = req.body.edit_id
    try {
        const video = await Video.findOne({ _id: edit_id }).exec();
        if (!video) {
            return res.status(404).json({ error: "Vidoe not found" });
        }

        res.render('./component/pages/edits/videos/subthai', { active: 'dashboard', video, usersesstion })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.AddOTT = async (req, res) => {
    const usersesstion = req.session.userlogin
    const edit_id = req.body.edit_id
    try {
        const video = await Video.findOne({ _id: edit_id }).exec();
        if (!video) {
            return res.status(404).json({ error: "Vidoe not found" });
        }

        res.render('./component/pages/edits/videos/links_platform', { active: 'dashboard', video, usersesstion })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.addLinkPathform = async (req, res) => {
    const ott_id = req.body.ott_id;
    try {
        const video = await Video.findOneAndUpdate(
            { _id: ott_id },
            {
                web: req.body.web,
                bilibili: req.body.bilibili,
                Iqiyi: req.body.Iqiyi,
                youtube: req.body.youtube,
                netflix: req.body.netflix,
            },
            { new: true }
        ).exec();
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.redirect('/?alertMessage=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// exports.Addsubthaiedit = upload.single('file_sub'), async (req, res) => {
   
// }
