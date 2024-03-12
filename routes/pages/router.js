const express = require("express")
const router = express.Router()
const source = require('../../routes/source')
const dashboard = require('../../routes/pages/dashboard/index')
const videoDashboard = require('../../routes/pages/dashboard/videos/index')

router.use(source)
router.use(dashboard)
router.use(videoDashboard)

module.exports = router