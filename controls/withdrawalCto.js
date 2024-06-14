const Video = require('../models/video');
const User = require('../models/user')
const WithdrawalHistory = require('../models/withdrawalHistory');

exports.withdrawalId = async (req, res) => {
    try {
        const { userId, withdrawalId } = req.params;
        const user = await User.findById(userId).populate('withdrawalHistory');
        if (!user) {
            return res.status(404).send('User not found');
        }

        const withdrawal = await WithdrawalHistory.findById(withdrawalId);
        if (!withdrawal) {
            return res.status(404).send('Withdrawal not found');
        }

        withdrawal.paid = true;
        await withdrawal.save();
        console.log(withdrawal)

        res.redirect('/admin/withdrawal/usersAll');
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการอัพเดตสถานะการจ่ายเงิน');
    }
}

exports.refuseWithdrawal = async (req, res) => {
    try {
        const { userId, withdrawalId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const withdrawal = await WithdrawalHistory.findById(withdrawalId);
        if (!withdrawal) {
            return res.status(404).send('Withdrawal not found');
        }

        withdrawal.paid = false;
        withdrawal.rejected = true;
        withdrawal.rejectReason = reason;
        await withdrawal.save();

        res.redirect('/admin/withdrawal/usersAll');
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการปฏิเสธการถอนเงิน');
    }
}

exports.getWithdrawal = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const today = new Date();

        const users = await User.find().populate('withdrawalHistory');
        res.render('./admin/pages/Getwithdrawal', {
            users,
            active: 'home-admin-withdrawal',
            usersesstion
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
    }
}
