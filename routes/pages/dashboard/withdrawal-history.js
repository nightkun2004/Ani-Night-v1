const express = require("express")
const router = express.Router()
const Acticle = require('../../../models/acticle')
const User = require('../../../models/user')
const WithdrawalHistory = require('../../../models/withdrawalHistory');

router.get('/withdrawal-history', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;

        // หาข้อมูลผู้ใช้จาก user ID
        const user = await User.findById(usersesstion).populate('withdrawalHistory').sort({ createdAt: -1 });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // ดึงประวัติการถอนเงินของผู้ใช้
        const withdrawalHistory = user.withdrawalHistory;

        // ส่งข้อมูลไปยังหน้าแสดงผล HTML
        return res.render('./component/pages/dashboard/withdrawal-history', {
            active: 'withdrawHistory',
            withdrawalHistory,
            usersesstion
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/api/withdrawal-history/:id', async (req, res) => {
    try {
        const userid = req.params.id;
        // หาข้อมูลผู้ใช้จาก user ID
        const user = await User.findById(userid).populate('withdrawalHistory');
        if (!user) {
            return res.status(404).send('User not found');
        }

        // ดึงประวัติการถอนเงินของผู้ใช้
        let withdrawalHistory = user.withdrawalHistory;

        // เรียงลำดับประวัติการถอนเงินโดยให้ข้อมูลล่าสุดอยู่บนสุด
        withdrawalHistory = withdrawalHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // ส่งข้อมูลไปยังหน้าแสดงผล HTML
        return res.json(withdrawalHistory);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});


module.exports = router