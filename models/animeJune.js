const mongoose = require('mongoose');

const animeJuneSchema = new mongoose.Schema({
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
    netflix: {
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
    Dubbings: {
        dubthai: [
            {
                namevoice: {
                    type: String
                },
                voiceimage: {
                    type: String
                },
                character: {
                    type: String
                },
                role: {
                    type: String
                },
                characterimage: {
                    type: String
                }
            }
        ],
        dubjpan: [
            {
                namevoice: {
                    type: String
                },
                voiceimage: {
                    type: String
                },
                character: {
                    type: String
                },
                role: {
                    type: String
                },
                characterimage: {
                    type: String
                }
            }
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const animeJune = mongoose.model('animeJune', animeJuneSchema);

module.exports = animeJune; 