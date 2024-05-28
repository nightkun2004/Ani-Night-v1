const express = require("express")
const router = express.Router()
const source = require('../../routes/source')
const dashboard = require('../../routes/pages/dashboard/index')
const monetizationRouter = require('../../routes/pages/dashboard/monetization')
const Animeroute = require('../../routes/pages/anime') 
const categoriesroute = require('../../routes/pages/categories') 
const videoDashboard = require('../../routes/pages/dashboard/edits/videos/index')
const editaimeboard = require('../../routes/pages/dashboard/edits/animeboard')

const forumRoute = require('../../routes/pages/forum')

router.use(source)
router.use(dashboard)
router.use(monetizationRouter)
router.use(videoDashboard)
router.use(Animeroute)
router.use(categoriesroute)
router.use(editaimeboard)
router.use(forumRoute)

module.exports = router