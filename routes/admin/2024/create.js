const express = require('express')
const router = express.Router()
const {verifyToken,verifyTokenAdmin} = require('../../../middleware/auth')
const User = require('../../../models/user')
const AnimeBord = require('../../../models/animebord')
const createAnime = require('../../../controls/createAnimeRoute')

router.get('/admin/createAnime/July', verifyTokenAdmin, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/2024/createJuly', { usersesstion, active: 'createAnime-admin' });
});
router.get('/admin/createAnime/June', (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/2024/createJune', { usersesstion, active: 'createAnime-admin' });
});
router.get('/admin/createAnime/August', (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/2024/createJune', { usersesstion, active: 'createAnime-admin' });
});
router.get('/admin/createAnime/October', (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/2024/createOctober', { usersesstion, active: 'createAnime-admin' });
});

router.post('/createAnime/July', createAnime.AddanimeJuly)
router.post('/createAnime/June', createAnime.AddanimeJune)
router.post('/createAnime/October/new', createAnime.AddanimeOctober)

module.exports = router