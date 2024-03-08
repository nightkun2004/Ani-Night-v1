const express = require("express")
const router = express.Router()
const uploadActicle = require('../uploads/acticle')
const tags = require('../../../routes/pages/tags/tags')
const video_upload = require('../../../routes/pages/uploads/video')

router.use(uploadActicle)
router.use(tags)
router.use(video_upload)

module.exports = router