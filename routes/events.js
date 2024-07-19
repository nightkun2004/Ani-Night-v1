const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity")

router.get('/events', async (req,res)=>{
    const usersesstion = req.session.userlogin;
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.render('./component/events/index', {active: 'events', activities ,usersesstion})
})
router.get('/event/ABEMA', (req,res)=>{
    const usersesstion = req.session.userlogin;
    res.render('./component/events/info', {active: 'events', usersesstion})
})

module.exports = router;