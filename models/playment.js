const mongoose = require('../config')

const playmentSchema = new mongoose.Schema({
    userid: String,
    name: {
        type: String
    },
    truemoney: {
        type: String
    },
})

const Payment = mongoose.model('Payment', playmentSchema);

module.exports = Payment;