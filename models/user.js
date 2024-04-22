const mongoose = require("../config")

const userSchema= new mongoose.Schema({
    userid: {
        type: String,
        unique: true,
        required: true
    }, 
    name: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    url: {
        type: String,
        default: "@",
        set: function(value) {
            if (value) {
                return value;
            } else {
                return "@";
            }
        }
    },
    password: {
        type: String
    },
    followers: {
        type: Number,
        default: 0
    },
    followed: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: "ลองใสคำอธิบายเพื่อแนะนำให้ผู้ใช้อื่นรู้จังสิ..."
    },
    profile: {
        type: String,
        default: ""
    },
    acticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Acticle'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }], 
    posts: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }],
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'History'
    }],
    verfly: [
        {
            type: String
        }
    ],
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    approval_admin: {
        type: Boolean,
        default: false 
    },
})

const User = mongoose.model('User', userSchema);

module.exports = User;