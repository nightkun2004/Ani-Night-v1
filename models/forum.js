const mongoose = require('mongoose');

const User = require('../models/user');

const ForumSchema = new mongoose.Schema({
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
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ], 
    bookmarkby : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ], 
    text_mass: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    bookmarks: {
        type: Number,
        default: 0
    },
    reposts: {
        type: Number,
        default: 0
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
                createdAt: { type: Date, default: Date.now }
            }
        ]
});

const Forum = mongoose.model('Forum', ForumSchema);

module.exports = Forum; 