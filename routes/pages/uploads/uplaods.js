const express = require("express")
const router = express.Router()
const uploadActicle = require('../uploads/acticle')
const tags = require('../../../routes/pages/tags/tags')

router.use(uploadActicle)
router.use(tags)

module.exports = router