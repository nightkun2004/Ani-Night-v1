const express = require("express")
const router = express.Router()
const source = require('../../routes/source')
const dashboard = require('../../routes/pages/dashboard/index')
const Animeroute = require('../../routes/pages/anime') 
const videoDashboard = require('../../routes/pages/dashboard/edits/videos/index')
const editaimeboard = require('../../routes/pages/dashboard/edits/animeboard')

router.use(source)
router.use(dashboard)
router.use(videoDashboard)
router.use(Animeroute)
router.use(editaimeboard)

module.exports = router