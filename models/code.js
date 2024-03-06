const mongoose = require('../config');

const rewardSchema = new mongoose.Schema({
    code: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;