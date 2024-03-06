const mongoose = require('../config/database');
const Viedo = require('../models/video')
const User = require('../models/user')

const commentvideoSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profile: {
    type: String
  }
});

const Commentvideo = mongoose.model('commentvideo', commentvideoSchema);

module.exports = Commentvideo;