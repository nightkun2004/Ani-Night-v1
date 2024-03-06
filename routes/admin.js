const express = require("express");
const router = express.Router();
const adminlogin = require('../routes/admin/login')
const admindash = require('../routes/admin/dash')
const anifan = require('../routes/anifandub')
const info = require('../routes/info')

router.use(adminlogin)
router.use(admindash)
router.use(anifan)
router.use(info)

module.exports = router;