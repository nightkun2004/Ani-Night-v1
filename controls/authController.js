const User = require("../models/user")

// ===================== ติดตามผู้ใช้งาน
// POST /api/users/user/follow/:id
const getFollow = async (req, res, next) => {
    try {
        const followingId = req.params.id; // ID ของผู้ใช้ที่ต้องการติดตาม
        const followerId = req.user.id; // ID ของผู้ใช้ที่ติดตาม

        // ตรวจสอบว่าไม่สามารถติดตามตัวเองได้
        if (followerId === followingId) {
            return res.status(400).json({ message: 'คุณไม่สามารถติดตามตัวเองได้', })
        }

        // ตรวจสอบว่าผู้ใช้ที่ต้องการติดตามนั้นอยู่ในรายการที่ผู้ใช้ติดตามอยู่แล้วหรือไม่
        const user = await User.findById(followerId);
        if (user.following.includes(followingId)) {
            return res.status(400).json({ message: 'คุณติดตามผู้ใช้งานนี้แล้ว', })
        }

        // อัปเดตผู้ใช้ที่ติดตาม
        await User.findByIdAndUpdate(followerId, {
            $push: { following: followingId }
        });

        // อัปเดตผู้ใช้ที่ถูกติดตาม
        await User.findByIdAndUpdate(followingId, {
            $push: { followers: followerId }
        });

        res.status(201).json({ message: "ติดตามผู้ใช้งานสำเร็จ" });

    } catch (error) {
        return res.status(500).json({ message: 'กิดข้อผิดพลาดในการติดตามผู้ใช้งาน', })
    }
};



// ===========================GET followers และ following
// GET /api/user/:id/followers
const getFollowers = async (req, res, next) => {
    try {
        const userId = req.params.id; // ID ของผู้ใช้ที่ต้องการดึงข้อมูล
        const currentUserId = req.user.id; // ID ของผู้ใช้ที่ทำการดึงข้อมูล

        // ค้นหาผู้ใช้ที่ต้องการ
        const user = await User.findById(userId).populate('followers', 'username email profilePicture');
        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้งานน', })
        }

        // ค้นหาผู้ใช้ที่ติดตามผู้ใช้ที่ต้องการ
        const followers = user.followers;

        // ตรวจสอบการยกเลิกการติดตาม
        if (currentUserId) {
            // ตรวจสอบว่าผู้ใช้ปัจจุบันติดตามผู้ใช้ที่ต้องการหรือไม่
            const isFollowing = user.followers.some(f => f._id.toString() === currentUserId);

            if (isFollowing) {
                // ยกเลิกการติดตาม
                await User.findByIdAndUpdate(userId, {
                    $pull: { followers: currentUserId }
                });

                await User.findByIdAndUpdate(currentUserId, {
                    $pull: { following: userId }
                });

                return res.status(200).json({ message: 'ยกเลิกการติดตามแล้ว' });
            } else {
                return res.status(400).json({ message: 'คุณไม่ได้ติดตามผู้ใช้งานนี้' });
            }
        }

        // ส่งข้อมูลผู้ติดตามและผู้ติดตาม
        const following = await User.find({ following: userId }).populate('following', 'username email profilePicture');

        res.status(200).json({
            followers: followers,
            following: following
        });

    } catch (error) {
        return res.status(500).json({ message: 'เกิดข้อผิดพลาก', })
    }
};



module.exports = { getFollow, getFollowers }