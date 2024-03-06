const express = require('express')
const router = express.Router()
const axios = require('axios');

router.get('/anifan', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const response = await axios.get('https://api-vioce-datas2.onrender.com/api/datathaidub');
        const animeData = response.data.anime2024; // เลือกข้อมูลอนิเมะจาก API

        // ส่งข้อมูลไปที่หน้าเว็บผ่าน EJS template
        res.render('anifandub', {
            usersesstion,
            active: 'anifan',
            animeList: animeData
        });
    } catch (error) {
        console.error('Error fetching anime data:', error);
        res.status(500).send('Error fetching anime data');
    }
});

module.exports = router