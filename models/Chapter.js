const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    comic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comic',
        required: true
    },
    ep: { type: Number, required: true },
    pages: [{
        type: String,
        unique: true,
        required: true
    }],
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const Chapter = mongoose.model('Chapter', ChapterSchema);

module.exports = Chapter;
