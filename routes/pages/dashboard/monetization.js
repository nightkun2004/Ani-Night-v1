const express = require("express")
const router = express.Router()
const Acticle = require('../../../models/acticle')
const User = require('../../../models/user')
const authenticatetoken = require('../../../middleware/authtoken')

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

router.get('/:url/monetization/overview', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const url = req.params.url;

         // Find user by session userlogin (assuming userlogin contains user ID)
         const user = await User.findById(usersesstion);
         if (!user) {
             return res.status(404).send('User not found');
         }
 
         // Calculate total views
         const totalViews = await user.calculateTotalViews();

         // Mock data for the chart (replace this with actual data)
        const chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            data: [65, 59, 80, 81, 56, 55, 40] // Replace this with actual data
        };

        res.render('./component/pages/dashboard/monetization', {
            active: 'monetization',
            usersesstion,
            totalViews,
            chartData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:url/monetization/overview-data', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const url = req.params.url;

        const user = await User.findById(usersesstion);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Mock data for the chart (replace this with actual data)
        const chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            data: [65, 59, 80, 81, 56, 55, 40] // Replace this with actual data
        };

        res.json(chartData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router