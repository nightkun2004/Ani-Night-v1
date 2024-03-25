const mongoose = require('mongoose');

const User = require('../models/user');

const ArticleSchema = new mongoose.Schema({
    tags: [String],
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
        type: String
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
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment',
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
    }
});

const Acticle = mongoose.model('Acticle', ArticleSchema);

module.exports = Acticle; 