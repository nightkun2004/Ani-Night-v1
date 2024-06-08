const express = require("express")
const router = express.Router()
const Acticle = require('../../../models/acticle')
const User = require('../../../models/user')
const WithdrawalHistory = require('../../../models/withdrawalHistory');
const authenticatetoken = require('../../../middleware/authtoken')

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

router.get('/studio/:id/monetization/withdraw', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const userId = req.params.id;

        if (!usersesstion) {
            return res.redirect("/login")
        }

        // Find user by session userlogin (assuming userlogin contains user ID)
        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('./component/pages/dashboard/withdraw', {
            active: 'withdraw',
            usersesstion,
            user,
            errorMessage: null,
            messagess: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/withdraw/payment', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const withdrawMethod = req.body.withdrawMethod;

        // หาข้อมูลผู้ใช้จาก user ID
        const user = await User.findById(usersesstion);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // ตรวจสอบว่าผู้ใช้มีคะแนนเพียงพอที่จะถอนเงินหรือไม่
        let pointsToDeduct = 0;
        let withdrawMessage = "";
        switch (withdrawMethod) {
            case '1':
                pointsToDeduct = 2000;
                withdrawMessage = "ถอนเงินจำนวน 0.20 บาท";
                break;
            case '2':
                pointsToDeduct = 5000;
                withdrawMessage = "ถอนเงินจำนวน 0.50 บาท";
                break;
            case '3':
                pointsToDeduct = 10000;
                withdrawMessage = "ถอนเงินจำนวน 1.10 บาท";
                break;
            default:
                return res.status(400).json({ message: "Invalid withdraw method" });
        }
        if (user.points < pointsToDeduct) {
            // ส่งคำตอบกลับไปยังผู้ใช้
            return res.render('./component/pages/dashboard/withdraw', {
                active: 'withdraw',
                usersesstion,
                user,
                errorMessage: "คุณมีคะแนนไม่เพียงพอ !",
                messagess: null
            });
        }

        // หักคะแนนจากผู้ใช้
        user.points -= pointsToDeduct;

        // บันทึกประวัติการถอนเงิน
        const withdrawal = new WithdrawalHistory({
            amount: pointsToDeduct,
            method: withdrawMethod,
            message: withdrawMessage,
            phoneNumber: user.truemoney
        });

        await withdrawal.save();

        // เชื่อมโยงประวัติการถอนเงินกับผู้ใช้
        if (!user.withdrawalHistory) {
            user.withdrawalHistory = [];
        }
        user.withdrawalHistory.push(withdrawal._id);

        // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
        await user.save();

        // ส่งคำตอบกลับไปยังผู้ใช้
        return res.render('./component/pages/dashboard/withdraw', {
            active: 'withdraw',
            usersesstion,
            user,
            messagess: "ถอนเงินสำเร็จแล้วครับ คาดว่าจะได้รับใน 1 - 2 วันครับ",
            errorMessage: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router