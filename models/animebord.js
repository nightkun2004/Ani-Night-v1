const mongoose = require('mongoose');

const User = require('../models/user');

const animebordlSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    animeApril: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'animeApril' 
    }],
    animeMay: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'animeMay'
    }],
    animeJuly: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'animeJuly'
    }],
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
});

const animebord = mongoose.model('animebord', animebordlSchema);

module.exports = animebord; 