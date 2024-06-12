const express = require("express")
const router = express.Router()
const AnimeApril = require('../../models/animeApril');
const Comicposter = require("../../models/Comic");
const Chapter = require("../../models/Chapter");

router.get('/comics', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const comics = await Comicposter.find().sort({ publicationStartTime: -1, views: -1 });
    try {
        res.render("./component/pages/comics", {usersesstion,comics})
    } catch (error) {
        console.error("Error fetching anime data:", error);
    }
});

router.get('/comic/info/:id', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const comicID = req.params.id;
    const comic = await Comicposter.findById(comicID).populate('chapters');
    const chapters = await Chapter.find({ comic: comicID });
    try {
        res.render("./component/pages/ComicInfo", { usersesstion, comic, chapters });
    } catch (error) {
        console.error("Error fetching anime data:", error);
    }
});

module.exports = router