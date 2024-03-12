const express = require("express")
const router = express.Router()
const Acticle = require('../../../models/acticle')
const User = require('../../../models/user')

function setLanguage(req, res, next) {
    const lang = req.query.lang || req.headers['accept-language'] || 'en'; // ถ้าไม่ได้ระบุภาษาใน query parameter ให้ใช้ภาษาจาก Header Accept-Language หรือถ้าไม่มีให้ใช้เป็นอังกฤษ
    req.language = lang && lang.includes('th') ? 'th' : 'en'; // ตั้งค่าภาษาตามที่ผู้ใช้เลือก
    next();
}

router.use(setLanguage);

const ITEMS_PER_PAGE = 12;

router.get('/:url/dashboard', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const url = req.params.url;
        const page = +req.query.page || 1; // หากไม่มีค่า page ให้เริ่มที่หน้าแรก

        if (!usersesstion) {
            return res.redirect('/');
        }

        // ดึงข้อมูลผู้ใช้และบทความทั้งหมดของผู้ใช้
        const userData = await User.findOne({ _id: usersesstion._id, url: url })
            .populate({
                path: "acticles",
                options: {
                    skip: (page - 1) * ITEMS_PER_PAGE,
                    limit: ITEMS_PER_PAGE
                }
            });

        // ตรวจสอบว่ามีบทความครบ 12 อันแล้วหรือไม่
        if (userData.acticles.length >= 12) {
            // หากมี 12 อันขึ้นไปให้สร้างรายการใหม่
            const newPage = Math.ceil(userData.acticles.length / ITEMS_PER_PAGE);
            return res.redirect(`/dashboard/${url}?page=${newPage}`);
        }



        // ดึงข้อมูลการชำระเงินของผู้ใช้
        const payment = await User.findOne({ _id: usersesstion._id })
            .populate('payment')
            ;

        res.render('./component/pages/dashboard/index', {
            active: 'dashboard',
            usersesstion,
            userData,
            payment,
            language: req.language,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page, // ตรวจสอบว่ามีหน้าถัดไปหรือไม่
            hasPrevPage: page > 1, // ตรวจสอบว่ามีหน้าก่อนหน้าหรือไม่
            nextPage: page + 1, // หน้าถัดไป
            prevPage: page - 1, // หน้าก่อนหน้า
            lastPage: Math.ceil(ITEMS_PER_PAGE)
        });
    } catch (error) {
        console.error(error);
        // สามารถเพิ่มการจัดการข้อผิดพลาดเพิ่มเติมได้ตามความเหมาะสม
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router