const mongoose = require('mongoose');

const animeJulySchema = new mongoose.Schema({
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
    web: {
        type: String
    },
    bilibili: {
        type: String
    },
    nameep: {
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
    yt_text: {
        type:String
    },
    crunchyroll: {
        type:String
    },
    Synopsis: {
        type:String
    },
    linkdemo: {
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const animeJuly = mongoose.model('animeJuly', animeJulySchema);

module.exports = animeJuly; 