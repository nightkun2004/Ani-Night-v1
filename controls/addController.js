const Video = require('../models/video');
const User = require('../models/user')
const sharp = require('sharp');
const crypto = require("crypto")
const HttpError = require("../models/errorModel")
const fs = require('fs');
const path =require('path')

exports.Addsubthai = async (req, res) => {
    const usersesstion = req.session.userlogin
    const edit_id = req.body.edit_id
    try {
        const video = await Video.findOne({ _id: edit_id }).exec();
        if (!video) {
            return res.status(404).json({ error: "Vidoe not found" });
        }

        res.render('./component/pages/edits/videos/subthai', { active: 'dashboard', video, usersesstion })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.AddOTT = async (req, res) => {
    const usersesstion = req.session.userlogin
    const edit_id = req.body.edit_id
    try {
        const video = await Video.findOne({ _id: edit_id }).exec();
        if (!video) {
            return res.status(404).json({ error: "Vidoe not found" });
        }

        res.render('./component/pages/edits/videos/links_platform', { active: 'dashboard', video, usersesstion })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.addLinkPathform = async (req, res) => {
    const ott_id = req.body.ott_id;
    try {
        const video = await Video.findOneAndUpdate(
            { _id: ott_id },
            {
                web: req.body.web,
                bilibili: req.body.bilibili,
                Iqiyi: req.body.Iqiyi,
                youtube: req.body.youtube,
                netflix: req.body.netflix,
            },
            { new: true }
        ).exec();
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.redirect('/?alertMessage=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.AddBanner = async (req, res) => {
    const image = req.body.image;

    // ดึงประเภท MIME จาก base64 string
    const mimeType = image.match(/^data:(image\/[a-zA-Z]*);base64,/)[1];
    const extension = mimeType.split('/')[1]; // 'png', 'jpeg', 'jpg', etc.

    const base64Data = image.replace(/^data:image\/[a-zA-Z]*;base64,/, "");

    // สร้างชื่อไฟล์ใหม่โดยใช้ UUID และนามสกุลที่ได้
    const newFilename = crypto.randomUUID() + '.' + extension;
    const newImagePath = path.join(__dirname, '..', 'src', 'public', 'banner', newFilename);

    fs.writeFile(newImagePath, base64Data, 'base64', async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดระหว่างอัพโหลด' });
        }

        try {
            // ตรวจสอบขนาดของภาพ
            const { width, height } = await sharp(newImagePath).metadata();

            // กำหนดขนาดที่ต้องการ
            const requiredWidth = 2560;
            const requiredHeight = 1440;

            if (width !== requiredWidth || height !== requiredHeight) {
                fs.unlink(newImagePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Failed to delete invalid file:', unlinkErr);
                    }
                });
                return res.status(400).json({
                    message: `Invalid image dimensions. Required ${requiredWidth}x${requiredHeight}, but got ${width}x${height}.`
                });
            }

            // ขนาดภาพถูกต้อง
            const userId = req.session.userlogin._id; // ตรวจสอบให้แน่ใจว่าคุณมี userId ใน req.session หรือใช้วิธีอื่นในการดึง userId
            const user = await User.findById(userId);
            if (!user) {
                fs.unlink(newImagePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Failed to delete invalid file:', unlinkErr);
                    }
                });
                return res.status(404).json({ message: 'User not found' });
            }

            // เก็บเฉพาะชื่อไฟล์ในฐานข้อมูล
            user.bannerImagePath = newFilename;
            await user.save();
            console.log(user)

            res.status(200).json({ message: 'อัพโหลดสำเร็จ ปิดหน้านี้ได้เลย!' });
        } catch (sharpErr) {
            console.error(sharpErr);
            fs.unlink(newImagePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Failed to delete invalid file:', unlinkErr);
                }
            });
            res.status(500).json({ message: 'Error processing image' });
        }
    });
};