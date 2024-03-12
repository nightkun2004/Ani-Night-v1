const mongoose = require('../config')

const subtitleSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    file: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // เพิ่มฟิลด์สำหรับซับไตในหลายภาษา
    subthai: {
        type: String,
        required: true,
    },
    subeng: {
        type: String,
        required: true,
    },
    subjpan: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Subtitle = mongoose.model('Subtitle', subtitleSchema);

module.exports = Subtitle;
