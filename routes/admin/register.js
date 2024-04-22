const express = require('express')
const router = express.Router()

router.get('/admin/register', (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/register', { usersesstion });
});

module.exports = router