const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Anime = require('../../models/Anime')

function setLanguage(req, res, next) {
    const lang = req.headers['accept-language'] || 'en';
    req.language = lang && lang.includes('th') ? 'th' : 'en';
    next();
}

router.use(setLanguage);

router.get("/browse/anime", async (req, res) => {
    const usersesstion = req.session.userlogin; 
    const animes = await Anime.find();
    const latestUpdatedAnimes = await Anime.find().sort({ updatedAt: -1 }).limit(10);
    const newestAnimes = await Anime.find().sort({ createdAt: -1 }).limit(10);

    res.render('./component/th/Animelists', { usersesstion, animes, latestUpdatedAnimes, newestAnimes })
})

router.get("/browse/anime/:id", async (req, res) => {
    const usersesstion = req.session.userlogin;
    const animeid = req.params.id;
    try {
        
        if (!mongoose.Types.ObjectId.isValid(animeid)) {
            return res.render("404", { usersesstion });
        }
        const anime = await Anime.findOne({_id: animeid});
        // console.log(anime)
        res.render('./component/th/animeinfo', { usersesstion, anime })
    } catch (err) {
        console.log(err)
    }

})


module.exports = router;
