const express = require("express")
const router = express.Router()
const userController = require('../../controls/userController')
// const ensureAuthenticated = require('../../middleware/login')
const authenticatetoken = require('../../middleware/authtoken')
const User = require('../../models/user');
const HttpError = require("../../models/errorModel")
const Activity = require("../../models/Activity")

router.get("/notification/user", async (req,res, next)=>{
    const usersesstion = req.session.userlogin;
    try {
        const notifications = await Activity.find({ notification: true }).sort({ createdAt: -1 }).exec();

        res.render("./component/pages/notification", { active: 'notification', notifications, usersesstion, alertMessage: req.query.alertMessage, data: false });
    } catch (error) {
        return next(new HttpError(error))
    }
})

module.exports = router