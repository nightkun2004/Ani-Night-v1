const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Comic = require("../models/Comic")
const Chapter = require("../models/Chapter")

router.get('/comic/content/:id/:ep', async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const comicId = req.params.id;
        const ep = parseInt(req.params.ep, 10);

        const comic = await Comic.findById(comicId);
        
        if (!comic) {
            return res.status(404).send('Comic not found');
        }
        
        const chapter = await Chapter.findOne({ comic: comicId, ep: ep }).exec();
        
        if (!chapter) {
            return res.status(404).send('Chapter not found');
        }

        const nextChapter = await Chapter.findOne({ comic: comicId, ep: ep + 1 }).exec();

        res.render('./component/read-comic', { comic, chapter, nextChapter, usersesstion });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router