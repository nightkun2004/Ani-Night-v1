const express = require("express");
const router = express.Router();

router.get('/events', (req,res)=>{
    const usersesstion = req.session.userlogin;
    res.render('./component/events/index', {usersesstion})
})
router.get('/event/ABEMA', (req,res)=>{
    const usersesstion = req.session.userlogin;
    res.render('./component/events/info', {usersesstion})
})

module.exports = router;