const mongoose = require('mongoose');

const User = require('../models/user');
const Chapter = require('../models/Chapter');

const ComicposterSchema = new mongoose.Schema({
    titlecomic: { type: String, required: true },
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
    categories: {
        type: Array,
        required: true
    },
    Synopsis: String,
    poster: String,
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
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


const Comicposter = mongoose.model('Comic', ComicposterSchema);

module.exports = Comicposter;
