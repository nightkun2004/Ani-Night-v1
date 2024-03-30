const express = require('express')
const router = express.Router()
const editActicle = require('../controls/editController')

router.get('/deleted', (req, res) => {
   const usersesstion = req.session.userlogin;
   res.render('deleted', { usersesstion })
})

router.get('/edit_video/editsubthai', (req,res) => {
   const usersesstion = req.session.userlogin;
   res.render('./component/pages/edits/videos/subthai', {usersesstion, active: 'dashboard'})
}) 

router.get('/delete/:id', editActicle.Delete)
router.get('/delete/video/:id', editActicle.DeleteVideo)

router.post('/edit_acticle', editActicle.editActicle)
router.post('/edit_video', editActicle.editVideo)
router.post('/edit/article/user', editActicle.editActicleuser)
router.post('/edit/video/user', editActicle.editVideouser) 

module.exports = router