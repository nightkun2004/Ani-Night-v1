const express = require('express')
const router = express.Router()
const editActicle = require('../controls/editController')

router.get('/deleted', (req, res) => {
   const usersesstion = req.session.userlogin;
   res.render('deleted', { usersesstion })
})
router.get('/delete/:id', editActicle.Delete)

router.post('/edit_acticle', editActicle.editActicle)
router.post('/edit/article/user', editActicle.editActicleuser)

module.exports = router