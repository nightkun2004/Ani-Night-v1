const mongoose = require('../config');

const linkCodeSchema = new mongoose.Schema({
    linkcode: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const linkCode = mongoose.model('linkCode', linkCodeSchema);

module.exports = linkCode;