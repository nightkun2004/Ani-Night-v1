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