const mongoose = require("../config")

const adminSchema= new mongoose.Schema({
    userid: {
        type: String
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
    profile: {
        type: String,
        default: ""
    },
    acticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Acticle'
    }],
    authorization: {
        type: String,
        default: "User" 
    },
    team: {
        type: String,
        default: "" 
    },
    approval_admin: {
        type: Boolean,
        default: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;