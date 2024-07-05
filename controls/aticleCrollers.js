const Acticle = require("../models/acticle")
const User = require("../models/user")
const HttpError = require("../models/errorModel")

// ============================= LIKE Post
// METHOT : /api/v1/posts/:id
const likePost = async (req,res, next) =>{
    try {
        const { id } = req.params;
        const userId = req.session.userlogin;

        const post = await Acticle.findById(id);
        if (!post) {
          return next(new HttpError("โพสต์ไม่พบ", 404));
        }
    
        const user = await User.findById(userId);
        if (!user) {
          return next(new HttpError("ผู้ใช้ไม่พบ", 404));
        }
    
        // Check if user has already liked the post
        const hasLiked = post.likes.includes(userId);

        let message;
        if (hasLiked) {
            // Remove like
            post.likes = post.likes.filter(like => like.toString() !== userId);
            message = "ยกเลิกไลค์โพสต์แล้ว";
        } else {
            // Add like
            post.likes.push(userId);
            message = "ไลค์โพสต์แล้ว";
        }

        post.likesCount = post.likes.length;

        await post.save();

        res.status(200).json({
            message: message,
            likesCount: post.likesCount
        });
      } catch (error) {
        return next(new HttpError(error.message, 500));
      }
}


module.exports = { likePost }