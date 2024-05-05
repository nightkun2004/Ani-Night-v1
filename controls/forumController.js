const Forum = require("../models/forum");
const User = require("../models/user");
const moment = require('moment');

exports.getPortforum = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        // Extract data from the request
        const { text_mass } = req.body;

        // Create a new forum post
        const newPost = new Forum({
            username: {
                id: usersesstion._id,
                username: usersesstion.username,
                profile: usersesstion.profile
            },
            text_mass: text_mass
        });

        await newPost.save();
        console.log(newPost)
        await User.findByIdAndUpdate(usersesstion._id, { $push: { forums: newPost._id } }, { new: true });

        res.redirect('/forums');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getForummain = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const forums = await Forum.find().populate('username.id').sort({ createdAt: -1 });
        forums.forEach(forum => {
            forum.formattedCreatedAt = moment(forum.createdAt).fromNow();
        });
        res.render('./component/forum', { usersesstion, active: 'forum', forums })
    } catch {
        console.error(error);
        res.status(500).send('Server Error', error);
    }
}

exports.getLikeforem = async (req, res) => {
    const usersession = req.session.userlogin;
    try {
        const forumId = req.params.forumId;
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).send('Tweet not found');
        }

        // ตรวจสอบว่าผู้ใช้กดถูกใจโพสต์นี้ไปแล้วหรือยัง
        const hasLiked = forum.likedBy ? forum.likedBy.includes(usersession._id) : false;

        if (!hasLiked) {
            // เพิ่มจำนวนการกดถูกใจและบันทึกข้อมูลโพสต์
            forum.likes += 1;
            if (!forum.likedBy) {
                forum.likedBy = [usersession._id];
            } else {
                forum.likedBy.push(usersession._id);
            }
            await forum.save();
        }

        // ส่งข้อมูลโพสต์กลับไปยังหน้าเว็บ
        res.json({ forum, hasLiked });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error', error);
    }
};

exports.getBookmark = async (req, res) => {
    const usersession = req.session.userlogin;
    try {
        const forumId = req.params.forumId;
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).send('Forum not found');
        }
        

        // Check if the forum is already bookmarked by the user
        const isBookmarked = forum.bookmarkby.some(usersession => usersession.equals(usersession._id));

        if (!isBookmarked) {
            forum.bookmarks += 1;
            // Update the forum's bookmarked by users
            forum.bookmarkby.push(usersession._id);
            await forum.save();
            await User.findByIdAndUpdate(usersession._id, { $push: { bookmarks: forum._id } }, { new: true });
        }

        res.json({ forum, isBookmarked });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error', error);
    }
}

exports.getForumreply = async (req,res) => {
    const usersesstion = req.session.userlogin;
    try {
        const { forumId, replyText } = req.body;
        // Find the forum post by ID 
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).json({ message: 'Forum post not found' });
        }
        // Add the reply to the forum's replies array
        forum.replies.push({
            replies: {
                id: usersesstion._id,
                username: usersesstion.username,
                profile: usersesstion.profile
            },
            content: replyText,
            createdAt: new Date()
        });
        // Save the updated forum post
        await forum.save();
        console.log(forum)
        res.status(200).json({ message: 'Reply added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}