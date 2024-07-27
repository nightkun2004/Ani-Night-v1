const express = require("express")
const router = express.Router()
const source = require('../../routes/source')
const dashboard = require('../../routes/pages/dashboard/index')
const monetizationRouter = require('../../routes/pages/dashboard/monetization')
const withdrawRouter = require('../../routes/pages/dashboard/withdraw')
const withdrawal_HistoryRouter = require('../../routes/pages/dashboard/withdrawal-history')
const ComicContent = require("../../routes/comic")
const comicsRoute = require("../../routes/pages/uploads/comics")
const ComicPages = require("../../routes/pages/comics")
const Animeroute = require('../../routes/pages/anime') 
const categoriesroute = require('../../routes/pages/categories') 
const videoDashboard = require('../../routes/pages/dashboard/edits/videos/index')
const editaimeboard = require('../../routes/pages/dashboard/edits/animeboard')
const PlaymentRouter = require("../../routes/pages/playmentRouter")

// Events
const EventRoute = require("../../routes/events")
const notificationRouter = require("../../routes/pages/notification")

const AnimtTHRoute = require('../../routes/th/anime')
const APISRoute = require('../../routes/apis')

const forumRoute = require('../../routes/pages/forum')

router.use(source)
router.use(dashboard)
router.use(AnimtTHRoute)
router.use(APISRoute)
router.use(monetizationRouter)
router.use(withdrawRouter)
router.use(withdrawal_HistoryRouter)
router.use(comicsRoute)
router.use(ComicContent)
router.use(ComicPages)
router.use(videoDashboard)
router.use(Animeroute)
router.use(categoriesroute)
router.use(editaimeboard)
router.use(forumRoute)
router.use(EventRoute)
router.use(notificationRouter)
router.use(PlaymentRouter)

module.exports = router