const mongoose = require('../config')
const User = require('../models/user')

const videoSchema = new mongoose.Schema({
    name: String,
    description: String,
    tags: [String],
    filePath: String,
    categories: String,
    videoid: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    notlike: {
        type: Number,
        default: 0
    },
    commentvideo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'commentvideo',
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    notLikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    subtitles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subtitle',
        },
    ],
    watched: {
        type: Boolean,
        default: false,
    },
    coverImage: {
        type: String,
        default: "viedo-tum.png"
    },
    username: String,
    profile: {
        type: String
    },    
    isViolatingPolicy: {
        type: Boolean,
        ref: 'Datapolicy',
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;