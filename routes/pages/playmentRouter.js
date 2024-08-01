const express = require("express")
const router = express.Router()
const {getTopup,webhook, getOrderStatus, postCreatePayment,getSuccessful, getPaymentCanceled} = require('../../controls/PlaymentsController')
// const ensureAuthenticated = require('../../middleware/login')
const authenticatetoken = require('../../middleware/authtoken')
const {authMiddlewareUser} = require('../../middleware/authMainuser')
const User = require('../../models/user');

router.post("/top/coin/create-checkout-session",authMiddlewareUser ,postCreatePayment)
router.post("/webhook",webhook)
router.get("/top/coin", getTopup)
router.get("/top/coin/checkout/order/:userid/:orderid", getOrderStatus)
router.get("/top/coin/Successful", getSuccessful)
router.get("/top/coin/Canceled",getPaymentCanceled)
 
module.exports = router