const User = require("../models/user")
const HttpError = require("../models/errorModel")
const Anishot = require("../models/Anishot")
const crypto = require('crypto');
const path = require("path")

// ============================getVideosAnishots
// GET: /api/v2/posts/anishots
const getAnishots = async (req, res, next) => {
    try {
        const anishots = await Anishot.find()
            .populate({
                path: 'createdBy',
                select: 'username profile'
            })
            .sort({
                updatedAt: -1
            })
            .exec();
        res.render('./component/videos/aniShots', { usersesstion: req.session.userlogin, anishots })
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ============================ get video Shot
// GET: /api/v2/posts/anishots
const getVideoShot = async (req, res, next) => {
    const videoId = req.params.id;
    try {
        const anishot = await Anishot.findById(videoId)
            .populate({
                path: 'createdBy',
                select: 'username profile'
            })
            .sort({
                createdAt: -1
            })
            .exec();
        res.render('./component/videos/infos/videoShot', { usersesstion: req.session.userlogin, anishot })
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ============================ getAnishots
// GET: /api/v2/posts/anishots?page=1&limit=10
const datasAnishot = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const anishots = await Anishot.find()
            .populate({
                path: 'createdBy',
                select: 'username profile'
            })
            .sort({
                updatedAt: -1
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const totalCount = await Anishot.countDocuments();

        res.json({
            anishots,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}

// ============================getVideosAnishots
// GET: /api/v2/posts/anishots
const putViewsAnishots = async (req, res, next) => {
    try {
        const anishot = await Anishot.findById(req.params.id);
        if (!anishot) {
            return res.status(404).send('ไม่พบ Anishot');
        }
        anishot.views += 1;
        await anishot.save();
        res.status(200).json({ views: anishot.views });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการนับวิว' });
    }
}

const getCreate = async (req, res) => {
    const usersesstion = req.session.userlogin;
    if (!usersesstion) {
        return res.redirect('/')
    }

    try {
        res.render("./component/pages/uploads/aniShot", { usersesstion })
    } catch (error) {
        return next(new HttpError(error))
    }
}


// =========================== createAnishots || express-fileupload
// POST: /api/v2/post/create/anishot
const CreateAnishot = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const userId = req.session.userlogin._id;

        if (!req.files || !req.files.video) {
            return res.status(400).json({ message: "ไม่พบไฟล์วีดีโอ." });
        }

        const videoFile = req.files.video;

        if (videoFile.size > 10000000) {
            return res.status(422).json({ message: "วีดีโอของคุณมีขนาดใหญ่เกิน 10MB" });
        }

        let fileName = videoFile.name;
        let splittedFilename = fileName.split('.');
        let newFilename = splittedFilename[0] + crypto.randomUUID() + '.' + splittedFilename[splittedFilename.length - 1];

        videoFile.mv(path.join(__dirname, '..', 'src/public/anishos', newFilename), async (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            } else {
                const newAnishot = new Anishot({
                    title,
                    description,
                    videoUrl: newFilename,
                    createdBy: userId
                });

                await newAnishot.save();
                await User.findByIdAndUpdate(userId, { $push: { anishots: newAnishot._id } }, { new: true });

                return res.status(201).json(newAnishot);
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// =========================== LikeAniShot Post
// POST: /api/v2/post/like/anishot/:id
const Likeanishot = async (req, res, next) => {
    const anishotId = req.params.id;
    const userId = req.session.userlogin._id;

    try {
        const anishot = await Anishot.findById(anishotId);

        if (!anishot) {
            return next(new HttpError("Anishot not found.", 404));
        }

        const hasLiked = anishot.likesBy.includes(userId);

        if (hasLiked) {
            // Remove like
            anishot.likesBy = anishot.likesBy.filter(id => id.toString() !== userId.toString());
            anishot.likes -= 1;
        } else {
            // Add like
            anishot.likesBy.push(userId);
            anishot.likes += 1;
        }

        await anishot.save();

        res.status(200).json({
            message: hasLiked ? "ยกเลิกไลค์โพสต์แล้ว" : "ไลค์โพสต์แล้ว",
            likes: anishot.likes
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}


// =========================== GET AUTHOR POST
// POST: /api/v1/posts/users/:id
const getAuthor = async (req, res, next) => {
    const authorId = req.params.id;
    try {
        // ดึงข้อมูลผู้ใช้ทั้งหมด รวมถึงฟิลด์ที่ต้องการ
        const author = await User.findById(authorId).select('username');
        if (!author) {
            return next(new HttpError("ไม่พบผู้ใช้งาน", 404));
        }

        // ดึงข้อมูล Anishots ของผู้ใช้
        const anishots = await Anishot.find({ creator: authorId }).populate('creator', 'username');

        res.render('./component/videos/aniShots', { author, anishots });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}

// =========================== Share Post
// GET: /api/v2/post/share/anishot/:id
const shareanishot = async (req, res, next) => {
    try {

    } catch (error) {
        return next(new HttpError(error))
    }
}


// =========================== Comment 
// req.user.id form middleware in login token
// POST: /api/v2/post/comment/anishot/:id
const Commentanishot = async (req, res, next) => {
    const { id } = req.params; // ID ของ Anishot ที่จะแสดงความคิดเห็น
    const { inputcomment } = req.body; // ความคิดเห็นที่ส่งมา

    if (!req.user || !req.user.id) {
        return next(new HttpError('Unauthorized', 401));
    }

    if (!inputcomment || inputcomment.trim() === '') {
        return res.status(400).json({ error: 'ความคิดเห็นว่าง โปรดใส่ความคิดเห็น' });
    }

    try {
        // ค้นหา Anishot ที่ต้องการแสดงความคิดเห็น
        const anishot = await Anishot.findById(id);

        if (!anishot) {
            return next(new HttpError('Anishot not found', 404));
        }

        // เพิ่มความคิดเห็นใหม่ลงใน Anishot
        anishot.comments.push({
            username: {
                id: req.session.userlogin._id,
                username: req.session.userlogin.username,
                profile: req.session.userlogin.profile // ใช้ profile จาก req.user
            },
            inputcomment,
        });

        // บันทึกการเปลี่ยนแปลง
        await anishot.save();

        res.status(201).json({ message: 'Comment added successfully', comments: anishot.comments });
    } catch (error) {
        return next(new HttpError('Failed to add comment', 500));
    }
};

const deleteComment = async (req, res, next) => {
    const { id, commentId } = req.params; // ID ของ Anishot และ Comment ที่จะลบ
  
    if (!req.user || !req.user.id) {
      return next(new HttpError('Unauthorized', 401));
    }
  
    try {
      // ค้นหา Anishot ที่ต้องการลบความคิดเห็น
      const anishot = await Anishot.findById(id);
  
      if (!anishot) {
        return next(new HttpError('Anishot not found', 404));
      }
  
      // ค้นหาและลบความคิดเห็นใน Anishot
      const commentIndex = anishot.comments.findIndex(comment => comment._id.toString() === commentId);
  
      if (commentIndex === -1) {
        return next(new HttpError('Comment not found', 404));
      }
  
      if (anishot.comments[commentIndex].username.id.toString() !== req.session.userlogin._id.toString()) {
        return next(new HttpError('Forbidden', 403));
      }
  
      anishot.comments.splice(commentIndex, 1);
  
      // บันทึกการเปลี่ยนแปลง
      await anishot.save();
  
      res.status(200).json({ message: 'Comment deleted successfully', comments: anishot.comments });
    } catch (error) {
      return next(new HttpError('Failed to delete comment', 500));
    }
  };


// =========================== bookmark save to User
// POST: /api/v2/post/bookmark/anishot/:id
const bookmarkanishot = async (req, res, next) => {
    const anishotId = req.params.id;
    const userId = req.session.userlogin._id;

    try {
        // ค้นหาผู้ใช้ตาม ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }

        // ค้นหาโพสต์ตาม ID
        const anishot = await Anishot.findById(anishotId);
        if (!anishot) {
            return res.status(404).json({ message: 'ไม่พบโพสต์' });
        }

        let message = '';
        if (user.bookmarks.includes(anishotId)) {
            // ยกเลิกการบันทึกโพสต์
            user.bookmarks.pull(anishotId);
            anishot.bookmarksCount -= 1;
            message = 'ยกเลิกการบันทึกโพสต์';
        } else {
            // บันทึกโพสต์
            user.bookmarks.push(anishotId);
            anishot.bookmarksCount += 1;
            message = 'บันทึกโพสต์สำเร็จ ';
        }

        await user.save();
        await anishot.save();

        res.status(200).json({ message, bookmarksCount: anishot.bookmarksCount });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}


// =========================== embed
// POST: /api/v2/post/embed/anishot/:id
// url: http://localhost:3000/embed/:anishotId
const embedanishot = async (req, res, next) => {
    try {

    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {
    getAnishots,
    getCreate,
    Commentanishot,
    CreateAnishot,
    getAuthor,
    Likeanishot,
    putViewsAnishots,
    bookmarkanishot,
    datasAnishot,
    getVideoShot,
    deleteComment
}