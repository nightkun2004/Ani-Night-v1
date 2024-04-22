const express = require("express")
const router = express.Router()
const mongoose = require("../../../config")
const Acticle = require("../../../models/acticle")
const User = require('../../../models/user')

router.get('/editor/:url/video', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const userId = req.params.id;
        const username = req.params.url;
        const userData = await User.findOne({ username: username })
            .populate('videos');

        res.render('./component/pages/channel/video', { 
            active: 'home',
            usersesstion,
            userData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
}) 

module.exports = router