const express = require('express')
const router = express.Router()
const verifyToken = require('../../../middleware/auth')
const User = require('../../../models/user')
const AnimeBord = require('../../../models/animebord')
const createAnime = require('../../../controls/createAnimeRoute')

router.get('/admin/createAnime/July', verifyToken, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/2024/createJuly', { usersesstion });
});

router.post('/createAnime/July', createAnime.AddanimeJuly)

module.exports = router