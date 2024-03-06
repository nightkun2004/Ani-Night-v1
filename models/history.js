const mongoose = require('../config')

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Acticle',
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    action: {
        type: String, 
        required: true
    }
});

const History = mongoose.model('History', historySchema);

module.exports = History;