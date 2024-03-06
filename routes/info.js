const express = require("express");
const router = express.Router();
const axios = require("axios");

// URL สำหรับ API ดึงข้อมูลอนิเมะ
const API_URL = 'https://api-vioce-datas2.onrender.com/api/datathaidub';

router.get('/info/:animeid', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
 
        const animeid = req.params.animeid;
        
        // สร้าง URL สำหรับการร้องขอข้อมูลอนิเมะ
        const url = `${API_URL}/${animeid}`;
        
        // ดึงข้อมูลอนิเมะจาก API โดยใช้ animeId เป็นอ้างอิง 
        const response = await axios.get(url);
        const animeData = response.data;

        // ส่งข้อมูลไปที่หน้าเว็บผ่าน EJS template
        res.render('./component/info', { usersesstion, animeData });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            // ถ้าไม่พบข้อมูลอนิเมะที่ระบุ
            res.status(404).send('Anime not found');
            return;
        }
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;