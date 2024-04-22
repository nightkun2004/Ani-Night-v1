const express = require("express")
const router = express.Router()
const mongoose = require("../config")
const Acticle = require("../models/acticle")
const Video = require('../models/video')

const perPage = 20; 

router.get('/foryou', async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const videos = await Video.find(); 

        if (!Array.prototype.shuffle) {
            Array.prototype.shuffle = function () {
                let currentIndex = this.length, randomIndex, temporaryValue;

                while (currentIndex !== 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;

                    temporaryValue = this[currentIndex];
                    this[currentIndex] = this[randomIndex];
                    this[randomIndex] = temporaryValue;
                }

                return this;
            };
        }

        videos.shuffle();

        const totalVideo = videos.length;
        const totalPages = Math.ceil(totalVideo / perPage);
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const skip = (currentPage - 1) * perPage;
        const paginatedVideos = videos.slice(skip, skip + perPage);

        res.render('./component/videos/index', {
            active: 'foryou', 
            usersesstion,
            videos,
            totalPages,
            paginatedVideos,
            currentPage
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error', err);
    }
})

module.exports = router