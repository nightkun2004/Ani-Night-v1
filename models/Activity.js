const mongoose = require("../config")

const activitySchema = new mongoose.Schema({
    title: String,
    description: String,
    notification: Boolean,
    link: String,
    imagePath: String
}, {timestamps: true});
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;