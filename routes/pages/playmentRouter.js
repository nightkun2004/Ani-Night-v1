const express = require("express")
const router = express.Router()
const {getTopup,webhook,postCreatePayment,getSuccessful, getPaymentCanceled} = require('../../controls/PlaymentsController')
// const ensureAuthenticated = require('../../middleware/login')
const authenticatetoken = require('../../middleware/authtoken')
const User = require('../../models/user');

router.get("/top/coin", getTopup)
router.post("/top/coin/create-checkout-session",postCreatePayment)
router.post("/webhook",webhook)
router.get("/top/coin/Successful", getSuccessful)
router.get("/top/coin/Canceled",getPaymentCanceled)

module.exports = router