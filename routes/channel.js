const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Acticle = require("../models/acticle")
const User = require('../models/user')
const { follow, unfollow} = require("../controls/userController")
const {authMiddleware} = require("../middleware/authMainuser")

router.get('/editor/:url', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const userId = req.params.id;
        const username = req.params.url;
        const userData = await User.findOne({ username: username })
            .populate('acticles');

        res.render('./component/channel', {
            active: 'home',
            usersesstion,
            userData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})
router.get('/editor/:url/anishots', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const userId = req.params.id;
        const username = req.params.url;
        const userData = await User.findOne({ username: username })
        .populate({
            path: 'anishots',
            populate: {
                path: 'createdBy',
                select: 'username profile'
            }
        }).exec();
        // console.log(userData.anishots)

        res.render('./component/pages/channel/anishhots.ejs', {
            active: 'anishots',
            usersesstion,
            userData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

router.post('/api/user/follow/:id', authMiddleware, follow);
router.post('/api/user/unfollow/:id', authMiddleware, unfollow);

module.exports = router