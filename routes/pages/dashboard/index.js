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

const ITEMS_PER_PAGE = 12;

router.get('/:url/dashboard', async (req, res) => { 
    try {
        const usersesstion = req.session.userlogin;
        const url = req.params.url;
        const page = +req.query.page || 1; 

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

        // ดึงข้อมูลการชำระเงินของผู้ใช้
        const payment = await User.findOne({ _id: usersesstion._id })
            .populate('payment')
            ;
              // นับจำนวนบทความทั้งหมดของผู้ใช้ที่เข้าสู่ระบบ
        const totalCount = await Acticle.countDocuments({ acticles: usersesstion._id });

        res.render('./component/pages/dashboard/index', {
            active: 'edit_article',
            usersesstion,
            userData,
            payment,
            language: req.language,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalCount,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1, 
            lastPage: Math.ceil(totalCount / ITEMS_PER_PAGE)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router