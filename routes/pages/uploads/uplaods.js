const express = require("express")
const router = express.Router()
const uploadActicle = require('../uploads/acticle')

router.use(uploadActicle)

module.exports = router