// const express = require("express")
// const router = express.Router()
// const Acticle = require('../models/acticle')
// const User = require('../models/user')

// router.get('/dashboard/:url', async (req, res) => {
//      try {
//          const usersesstion = req.session.userlogin;
//          const url = req.params.url;
 
//          if (!usersesstion) {
//              return res.redirect('/');
//          }
 
//          // ดึงข้อมูลผู้ใช้และบทความทั้งหมดของผู้ใช้
//          const userData = await User.findOne({ _id: usersesstion._id, url: url }).populate('acticles');
 
//          // ดึงข้อมูลการชำระเงินของผู้ใช้
//          const payment = await User.findOne({ _id: usersesstion._id }).populate('payment');
 
//          res.render('dashboard', { usersesstion, userData, payment });
//      } catch (error) {
//          console.error(error);
//          // สามารถเพิ่มการจัดการข้อผิดพลาดเพิ่มเติมได้ตามความเหมาะสม
//          res.status(500).send('Internal Server Error');
//      }
//  });


// module.exports = router