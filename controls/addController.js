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


// exports.Addsubthaiedit = upload.single('file_sub'), async (req, res) => {
   
// }
