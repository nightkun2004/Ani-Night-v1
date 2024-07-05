const mongoose = require('../config');

const anishotSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    comments: [

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
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarksCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Anishot = mongoose.model('Anishot', anishotSchema);

module.exports = Anishot;