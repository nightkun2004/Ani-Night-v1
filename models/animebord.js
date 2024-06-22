const mongoose = require('mongoose');

const User = require('../models/user');

const animebordlSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    animes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anime' 
    }],
    animeApril: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'animeApril' 
    }],
    animeMay: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'animeMay'
    }],
    animeJune: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'animeJune'
    }],
    animeJuly: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'animeJuly'
    }],
    animeOctober: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'animeOctober'
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