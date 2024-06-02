const AnimeApril = require('../models/animeApril');
const AnimeMay = require('../models/animeMay');
const AnimeBord = require('../models/animebord');
const AnimeJuly = require('../models/animeJuly');
const Video = require('../models/video');
const AnimeJune = require('../models/animeJune');

exports.Addanimemay = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const newAnime = new AnimeMay({
            nameAnime: req.body.nameAnime,
            Produced: req.body.Produced,
            manuscript: req.body.manuscript,
            episodes: req.body.episodes,
            start: req.body.start,
            linkImage: req.body.linkImage,

        });

        const author = {
            id: usersesstion._id,
            username: usersesstion.username,
            profile: usersesstion.profile
        };

        newAnime.author = author;
        const savedAnime = await newAnime.save();
        await AnimeBord.findOneAndUpdate({}, { $push: { animeMay: savedAnime._id }, $set: { author: author } }, { new: true, upsert: true });
        res.status(201).send('บันทึกข้อมูลอนิเมะสำเร็จ');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.AddanimeJune = async (req,res) =>{
    const usersesstion = req.session.userlogin;
    try {
        const newAnime = new AnimeJune({
            nameAnime: req.body.nameAnime,
            Produced: req.body.Produced,
            manuscript: req.body.manuscript,
            episodes: req.body.episodes,
            start: req.body.start,
            linkImage: req.body.linkImage,
            linkdemo: req.body.linkdemo,
            Synopsis: req.body.Synopsis,
        }) 

        const author = {
            id: usersesstion._id,
            username: usersesstion.username,
            profile: usersesstion.profile
        };

        newAnime.author = author;
        const savedAnime = await newAnime.save();
        await AnimeBord.findOneAndUpdate({}, { $push: { animeJune: savedAnime._id }, $set: { author: author } }, { new: true, upsert: true });
        res.status(201).send('บันทึกข้อมูลอนิเมะสำเร็จ');
    } catch(err) {
        res.status(400).send(err.message);
    }
}

exports.AddanimeJuly = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const newAnime = new AnimeJuly({
            nameAnime: req.body.nameAnime,
            Produced: req.body.Produced,
            manuscript: req.body.manuscript,
            episodes: req.body.episodes,
            start: req.body.start,
            linkImage: req.body.linkImage,
            linkdemo: req.body.linkdemo,
            Synopsis: req.body.Synopsis,
        });

        const author = {
            id: usersesstion._id,
            username: usersesstion.username,
            profile: usersesstion.profile
        };

        newAnime.author = author;
        const savedAnime = await newAnime.save();
        await AnimeBord.findOneAndUpdate({}, { $push: { animeJuly: savedAnime._id }, $set: { author: author } }, { new: true, upsert: true });
        res.status(201).send('บันทึกข้อมูลอนิเมะสำเร็จ');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.EditanimeMay = async (req, res) => {
    const update_id = req.body.update_id;
    try {
        const animeBord = await AnimeMay.findOne({ _id: update_id });
        if (!animeBord) {
            return res.status(404).json({ error: "AnimeBord not found" });
        }

        animeBord.nameAnime = req.body.nameAnime;
        animeBord.Produced = req.body.Produced;
        animeBord.manuscript = req.body.manuscript;
        animeBord.episodes = req.body.episodes;
        animeBord.start = req.body.start;
        animeBord.linkImage = req.body.linkImage;
        animeBord.info = req.body.info;
        animeBord.web = req.body.web;
        animeBord.bilibili = req.body.bilibili;
        animeBord.nameep = req.body.nameep;
        animeBord.Iqiyi = req.body.Iqiyi;
        animeBord.youtube = req.body.youtube;
        animeBord.netflix = req.body.netflix;
        animeBord.yt_text = req.body.yt_text;
        animeBord.crunchyroll = req.body.crunchyroll;

        await animeBord.save();

        res.redirect('/edit/anime/boards?alertMessageVideo=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// มิถุนายน
exports.EditanimeJune = async (req, res) => {
    const update_id = req.body.update_id;
    try {
        const animeBord = await AnimeJune.findOne({ _id: update_id });
        if (!animeBord) {
            return res.status(404).json({ error: "AnimeBord not found" });
        }

        animeBord.nameAnime = req.body.nameAnime;
        animeBord.Produced = req.body.Produced;
        animeBord.manuscript = req.body.manuscript;
        animeBord.episodes = req.body.episodes;
        animeBord.start = req.body.start;
        animeBord.linkImage = req.body.linkImage;
        animeBord.info = req.body.info;
        animeBord.web = req.body.web;
        animeBord.bilibili = req.body.bilibili;
        animeBord.nameep = req.body.nameep;
        animeBord.Iqiyi = req.body.Iqiyi;
        animeBord.youtube = req.body.youtube;
        animeBord.netflix = req.body.netflix;
        animeBord.yt_text = req.body.yt_text;
        animeBord.crunchyroll = req.body.crunchyroll;
        animeBord.Synopsis = req.body.Synopsis;
        animeBord.linkdemo = req.body.linkdemo;

        await animeBord.save();

        res.redirect('/edit/anime/boards?alertMessageVideo=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
exports.EditanimeJuly = async (req, res) => {
    const update_id = req.body.update_id;
    try {
        const animeBord = await AnimeJuly.findOne({ _id: update_id });
        if (!animeBord) {
            return res.status(404).json({ error: "AnimeBord not found" });
        }

        animeBord.nameAnime = req.body.nameAnime;
        animeBord.Produced = req.body.Produced;
        animeBord.manuscript = req.body.manuscript;
        animeBord.episodes = req.body.episodes;
        animeBord.start = req.body.start;
        animeBord.linkImage = req.body.linkImage;
        animeBord.info = req.body.info;
        animeBord.web = req.body.web;
        animeBord.bilibili = req.body.bilibili;
        animeBord.nameep = req.body.nameep;
        animeBord.Iqiyi = req.body.Iqiyi;
        animeBord.youtube = req.body.youtube;
        animeBord.netflix = req.body.netflix;
        animeBord.yt_text = req.body.yt_text;
        animeBord.crunchyroll = req.body.crunchyroll;
        animeBord.Synopsis = req.body.Synopsis;
        animeBord.linkdemo = req.body.linkdemo;

        await animeBord.save();

        res.redirect('/edit/anime/boards?alertMessageVideo=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// ลบเดือนเมซายน
exports.DeleteAnime = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const AnimeMayToDelete = await AnimeApril.findById(req.params.id);

        if (!AnimeMayToDelete) {
            return res.status(404).send('AnimeMay not found');
        }

        await AnimeApril.findByIdAndDelete(req.params.id, { useFindAndModify: false });
        res.redirect(`/edit/anime/boards`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

// พฤษภาลบ
exports.DeleteAnimeMay = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const AnimeMayToDelete = await AnimeMay.findById(req.params.id);

        if (!AnimeMayToDelete) {
            return res.status(404).send('AnimeMay not found');
        }

        await AnimeMay.findByIdAndDelete(req.params.id, { useFindAndModify: false });
        res.redirect(`/edit/anime/boards`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

// มิถุนายนลบ
exports.DeleteAnimeJune = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const AnimeJuneToDelete = await AnimeJune.findById(req.params.id);

        if (!AnimeJuneToDelete) {
            return res.status(404).send('AnimeJune not found');
        }

        await AnimeJune.findByIdAndDelete(req.params.id, { useFindAndModify: false });
        res.redirect(`/edit/anime/boards`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

// AnimeJuly Delete
exports.DeleteAnimeJuly = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const AnimeMayToDelete = await AnimeJuly.findById(req.params.id);

        if (!AnimeMayToDelete) {
            return res.status(404).send('AnimeJuly not found');
        }

        await AnimeJuly.findByIdAndDelete(req.params.id, { useFindAndModify: false });
        res.redirect(`/edit/anime/boards`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.Editvideos = async (req, res) => {
    const update_id = req.body.update_id;
    try {
        const usersesstion = req.session.userlogin;
        const video = await Video.findOne({ _id: update_id });

        res.render('/admin/edits/videoidedit')
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}