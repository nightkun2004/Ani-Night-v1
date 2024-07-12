const mongoose = require('mongoose');

const EpisodesSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    ep: { type: Number, required: true, default: 1 },
    fire: [{
        type: String,
        required: true
    }],
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    publicationStartTime: {
        type: Date,
        default: Date.now
    },
    expirationDate: Date,
    isPublished: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Episodes = mongoose.model('Episodes', EpisodesSchema);

module.exports = Episodes;