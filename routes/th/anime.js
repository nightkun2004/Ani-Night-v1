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
    const template = req.language === 'th' ? './component/th/Animelists' : './en/anime/animelists';

    res.render(template, { usersesstion, animes, latestUpdatedAnimes, newestAnimes, active: 'anime' })
})

router.get("/browse/anime/:id", async (req, res) => {
    const usersesstion = req.session.userlogin;
    const animeid = req.params.id;
    try {
        
        if (!mongoose.Types.ObjectId.isValid(animeid)) {
            return res.render("404", { usersesstion });
        }
        const anime = await Anime.findOne({_id: animeid});
        const template = req.language === 'th' ? './component/th/animeinfo' : './en/anime/animeinfo';
        // console.log(anime)
        res.render(template, { usersesstion, anime, active: 'anime' })
    } catch (err) {
        console.log(err)
    } 

})


module.exports = router;
