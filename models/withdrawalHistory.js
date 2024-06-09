const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    paid: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    },
    rejectReason: String
});

const WithdrawalHistory = mongoose.model('WithdrawalHistory', withdrawalSchema);

module.exports = WithdrawalHistory;
