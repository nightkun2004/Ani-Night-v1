const mongoose = require("../config")

const activitySchema = new mongoose.Schema({
    title: String,
    description: String,
    notification: Boolean,
    htmlFilePath: String,
    cssCdn: String,
    jsCdn: String,
    link: String,
    imagePath: String,
    linkurlparams: String
}, {timestamps: true});
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;