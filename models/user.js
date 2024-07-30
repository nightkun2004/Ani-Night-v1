const mongoose = require("../config")
// const Acticle = require("")

const userSchema = new mongoose.Schema({
    facebookId: String,
    userid: {
        type: String,
        unique: true,
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
        required: true
    },
    earnings: { type: Number, default: 0 },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anishot' }],
    anishots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anishot'
    }],
    bookmarksCount: { type: Number, default: 0 },   
    password: {
        type: String
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    bio: {
        type: String,
        default: "ลองใสคำอธิบายเพื่อแนะนำให้ผู้ใช้อื่นรู้จังสิ..."
    },
    profile: {
        type: String,
        default: "profile_De.jpg"
    },
    bannerImagePath: String,
    points: {
        type: Number,
        default: 0
    },
    truemoneyname: {
        type: String,
    },
    truemoney: {
        type: Number
    },
    googleprofile: {
        type: String,
        default: ""
    },
    acticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Acticle'
    }],
    // bookmarks: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'forum'
    //     }
    // ],
    forums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'forum'
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
    points: {
        type: Number,
        default: 0
    },
    withdrawalHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WithdrawalHistory'
        }
    ],
    role: {
        type: String,
        enum: ["user", "content_creator", "partners"],
        default: "user"
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    anishotsCount: Number,
    approval_admin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })




// lสำหรับคำนวณยอดวิว
userSchema.methods.calculateTotalViews = async function () {
    const Acticle = require('../models/acticle');
    const acticles = await Acticle.find({ 'author.id': this._id });
    return acticles.reduce((total, acticle) => total + acticle.views, 0);
};

// ฟังก์ชันสำหรับอัพเดตคะแนน (points) ของผู้ใช้ตามยอดวิวที่คำนวณได้
userSchema.methods.updatePoints = async function () {
    const totalViews = await this.calculateTotalViews();
    const newPoints = Math.floor(totalViews / 1000) * 2; // 1000 วิว = 2 บาท
    this.points = newPoints;
    await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;