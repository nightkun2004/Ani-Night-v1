// models/FloatingComment.js
const mongoose = require('../config')

const floatingCommentSchema = new mongoose.Schema({
    content: String,
    time: Number, // นาทีของวีดีโอที่จะแสดงความคิดเห็น
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FloatingComment = mongoose.model('FloatingComment', floatingCommentSchema);
module.exports = FloatingComment;
