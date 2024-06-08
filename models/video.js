const mongoose = require('../config')
const User = require('../models/user')
const Commentvideo = require('../models/commentvideo')
const Subtitle = require('../models/subtitle');

const videoSchema = new mongoose.Schema({
    name: String,
    description: String,
    tags:{ 
        type: Array,
        required: true
    },
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
            ref: 'Subtitle', // ระบุ ref เป็น 'Subtitle'
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
    web: {
        type: String
    },
    bilibili: {
        type: String
    },
    Iqiyi: {
        type:String
    },
    youtube: {
        type:String
    },
    netflix: {
        type:String
    },
    replies:
    [

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
    ]
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;