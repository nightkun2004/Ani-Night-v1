const express = require("express");
const router = express.Router();
const adminlogin = require('../routes/admin/login')
const admindash = require('../routes/admin/dash')

router.use(adminlogin)
router.use(admindash)

module.exports = router;