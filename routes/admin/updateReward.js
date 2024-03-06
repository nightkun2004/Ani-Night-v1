const express = require("express")
const router = express.Router()
const Reward = require('../../models/code')
const linkCode = require('../../models/linkcode')
const verifyToken = require('../../middleware/auth')

router.get('/reward/update', verifyToken, (req, res) => {
    res.render('./admin/updateReward');
});

router.post('/reward/update', verifyToken, async function(req, res) {
    const newRewardCode = req.body.new_code;

    try {
        // ตรวจสอบว่ารหัสใหม่นั้นมีอยู่ในระบบแล้วหรือไม่
        const isExistingNewCode = await Reward.exists({ code: newRewardCode });

        if (isExistingNewCode) {
            res.send("รหัสใหม่นี้มีอยู่ในระบบแล้ว");
        } else {
            // สร้างรหัสใหม่และบันทึกลงในฐานข้อมูล
            const newReward = new Reward({ code: newRewardCode });
            const updatedReward = await Reward.findOneAndUpdate(
                { code: { $exists: true } }, // เลือกเอกสารที่มีฟิลด์ code อยู่
                { code: newRewardCode }, // กำหนดค่าใหม่ให้กับฟิลด์ code
                { new: true } // ตั้งค่าให้คืนค่าเอกสารที่ถูกอัพเดต
            );
            res.send("อัพเดตรหัสใหม่เรียบร้อยแล้ว");
        }
    } catch (error) {
        console.log(error);
        res.send("เกิดข้อผิดพลาดในการอัพเดตรหัส");
    }
});

router.post('/reward/update-link-code', verifyToken, async function(req, res) {
    const Linkcode = req.body.linkcode;

    try {
        // ตรวจสอบว่ารหัสใหม่นั้นมีอยู่ในระบบแล้วหรือไม่
        const isExistingCode = await linkCode.exists({ linkcode: Linkcode });

        if (isExistingCode) {
            res.send("รหัสใหม่นี้มีอยู่ในระบบแล้ว");
        } else {
            // สร้างรหัสใหม่และบันทึกลงในฐานข้อมูล
            const newReward = new linkCode({ linkcode: Linkcode });
            const updatedReward = await linkCode.findOneAndUpdate(
                { linkcode: { $exists: true } }, // เลือกเอกสารที่มีฟิลด์ code อยู่
                { linkcode: Linkcode }, // กำหนดค่าใหม่ให้กับฟิลด์ code
                { new: true } // ตั้งค่าให้คืนค่าเอกสารที่ถูกอัพเดต
            );
            res.send("อัพเดตรซองอั่งเปาเรียบร้อยแล้ว");
        }
    } catch (error) {
        console.log(error);
        res.send("เกิดข้อผิดพลาดในการอัพเดตรหัส");
    }
});

module.exports = router