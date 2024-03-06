const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Acticle = require("../models/acticle")

router.get('/videos', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        res.render('./component/videos', { active: 'videos', usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

module.exports = router