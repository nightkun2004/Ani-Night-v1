const mongoose = require('mongoose');

const animeAprilSchema = new mongoose.Schema({
    nameAnime: {
        type: String
    },
    Produced: {
        type: String
    },
    manuscript: {
        type: String
    },
    episodes: {
        type: String
    },
    start: {
        type: String
    },
    linkImage: {
        type: String
    },
    info: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const animeApril = mongoose.model('animeApril', animeAprilSchema);

module.exports = animeApril; 