const mongoose = require('../config'); // นำเข้า mongoose จากการตั้งค่า
const User = require('../models/user'); // นำเข้า User model
const Commentvideo = require('../models/commentvideo'); // นำเข้า Commentvideo model
const Subtitle = require('../models/subtitle'); // นำเข้า Subtitle model

const videoSchema = new mongoose.Schema({
    // Schema fields
    name: String,
    description: String,
    tags: {
        type: Array,
        required: true
    },
    filePath: String,
    filequality144p: String,
    filequality240p: String,
    filequality360p: String,
    filequality480p: String,
    filequality720p: String,
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
            ref: 'Commentvideo',
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    notLikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    subtitles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subtitle',
        }
    ],
    watched: {
        type: Boolean,
        default: false,
    },
    coverImage: {
        type: String
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
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        profile: {
            type: String
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    subthai: {
        type: String,
    },
    replies: [
        {
            username: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: String,
                profile: {
                    type: String
                },
            },
            content: String,
            likes: {
                type: Number,
                default: 0
            },
            report: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    episodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Episodes'
    }],
    publicationStartTime: {
        type: Date,
        default: Date.now
    },
    expirationDate: Date,
    isPublished: {
        type: Boolean,
        default: false
    }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;