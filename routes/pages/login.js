const express = require("express")
const router = express.Router()
const userController = require('../../controls/userController')

router.get('/login', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const template = req.language === 'th' ? './component/pages/login' : './en/login';
        res.render(template, { active: 'login', usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

router.post('/login', userController.getLogin);
module.exports = router