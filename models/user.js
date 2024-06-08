const mongoose = require("../config")
// const Acticle = require("")

const userSchema = new mongoose.Schema({
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
        default: "@",
        set: function (value) {
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
        default: "profile_De.jpg"
    },
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
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'forum'
        }
    ],
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
    approval_admin: {
        type: Boolean,
        default: false
    },
})


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