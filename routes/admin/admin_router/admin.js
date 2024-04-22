const express = require('express')
const router = express.Router();
const verifyToken = require('../../../middleware/auth')
const isAdmin = require('../../../middleware/in_Admin')
const User = require('../../../models/user')

router.get('/add-admin', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        const usersesstion = req.session.userlogin;
        res.render('./admin/pages/add_Admin', {
            active: 'add-admin',
            usersesstion,
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/search/user/:userid', verifyToken, isAdmin, async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const userId = req.params.userid;
        const user = await User.findOne({ userid: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json([user]);
        res.render('./admin/pages/add_Admin', {
            active: 'add-admin',
            usersesstion,
            users: [user]
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/admin/approve/:userId', verifyToken , isAdmin,async (req, res) => {
    try {
        const userId = req.params.userId;
        const { approval_admin } = req.body;

        const user = await User.findOneAndUpdate(
            { userid: userId },
            { approval_admin: approval_admin },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router