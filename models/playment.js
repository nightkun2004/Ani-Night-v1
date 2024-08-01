const mongoose = require('../config')

const playmentSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: String,
    status: { type: String, default: 'pending' },
},{ timestamps: true})

const Payment = mongoose.model('Payment', playmentSchema);

module.exports = Payment;