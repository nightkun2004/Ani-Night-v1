const mongoose = require('../config');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    username: String, 
    profile: {
        type: String 
    },
},
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }, 
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;