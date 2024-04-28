const mongoose = require("../config")

const userSchema= new mongoose.Schema({
    nameforum: {
        type: String,
    },
})

const User = mongoose.model('User', userSchema);

module.exports = User;