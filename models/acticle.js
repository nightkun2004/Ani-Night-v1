const mongoose = require('mongoose');

const User = require('../models/user');

const ArticleSchema = new mongoose.Schema({
    tags: {
        type: Array,
        required: true
    },
    link_info: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    categories: {
        type: Array,
        required: true
    },
    photo: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    published: Boolean,
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
    date: { type: Date, default: Date.now },
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
                inputcomment: String,
                likes: {
                    type: Number,
                    default: 0
                },
                report: String,
                createdAt: { type: Date, default: Date.now }
            }
        ],
    url: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'likes'
    }],
    iduser: {
        type: String
    },
    profile: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    likesCount: {
        type: Number,
        default: 0
    }
},  { timestamps: true });

const Acticle = mongoose.model('Acticle', ArticleSchema);

module.exports = Acticle; 