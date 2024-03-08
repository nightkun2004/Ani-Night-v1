const express = require("express")
const router = express.Router()

router.get('/videos', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        if (!usersesstion) {
            return res.redirect('/')
        }
        res.render('./component/pages/videos/index', { active: 'video', usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})


module.exports = router