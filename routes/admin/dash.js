const express = require('express')
const router = express.Router()
const { verifyToken, verifyTokenAdmin } = require('../../middleware/auth')
const isAdmin = require('../../middleware/in_Admin')
const User = require('../../models/user')
const Article = require('../../models/acticle')
const Videos = require('../../models/video')
const WithdrawalHistory = require('../../models/withdrawalHistory');
const AnimeApril = require('../../models/animeApril')
const AnimeJuly = require('../../models/animeJuly')
const AnimeBord = require('../../models/animebord')
const Animemay = require('../../models/animeMay')
const Anime = require('../../models/Anime')
const createAnime = require('../../controls/createAnimeRoute')
const create_2024 = require('../../routes/admin/2024/create')
const Admin_Router = require('./admin_router/admin')
const AnimeJune = require('../../models/animeJune')
const { withdrawalId, getWithdrawal, refuseWithdrawal } = require('../../controls/withdrawalCto')
 

// Import Video Add Routes

const pageAddVideoRouter = require('../../routes/admin/pages/add_Video')

router.use(pageAddVideoRouter)

const PAGE_SIZE = 5;

router.get('/delete/anime/:id', createAnime.DeleteAnime);
router.get('/delete/AnimeMay/:id', createAnime.DeleteAnimeMay);
router.get('/delete/AnimeJune/:id', createAnime.DeleteAnimeJune);
router.get('/delete/AnimeJuly/:id', createAnime.DeleteAnimeJuly);
router.get('/delete/AnimeOctober/:id', createAnime.DeleteAnimeOctober);

router.get('/admin/dash', verifyTokenAdmin, async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayCount = await User.countDocuments({
            createdAt: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
            }
        });

        const yesterdayCount = await User.countDocuments({
            createdAt: {
                $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
                $lt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1)
            }
        });

        const userCountup = {
            total: todayCount,
            up: todayCount - yesterdayCount
        };

        const userCount = await User.countDocuments();
        const VideosCount = await Videos.countDocuments();
        const articleCount = await Article.countDocuments();
        const users = await User.find().populate('withdrawalHistory');
        res.render('./admin/dash', {
            userCount,
            users,
            userCountup,
            usersesstion,
            articleCount,
            VideosCount,
            active: 'home-admin',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
    }
});
 
router.get('/admin/withdrawal/usersAll', verifyTokenAdmin, getWithdrawal)
router.post('/admin/mark-paid/:userId/:withdrawalId', verifyTokenAdmin, withdrawalId);
router.post('/admin/refuse-withdrawal/:userId/:withdrawalId', verifyTokenAdmin, refuseWithdrawal);


router.get('/admin/update_code', verifyTokenAdmin, isAdmin, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/updateReward', {
        active: 'update-admin',
        usersesstion
    });
}); 

router.get('/admin/update_linkwallet', verifyTokenAdmin, isAdmin, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/updatelink', {
        active: 'update-update_linkwallet',
        usersesstion
    });
}); 

router.get('/admin/editvideos', verifyTokenAdmin, isAdmin, async (req, res) => {
    const usersesstion = req.session.userlogin;
    const userData = await Videos.find();
    res.render('./admin/edits/editvideos', {
        active: 'editvideos',
        usersesstion,
        userData
    });
});

router.get('/admin/createAnime', verifyTokenAdmin, isAdmin, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/createAnime', { usersesstion, active: 'createAnime-admin', });
});
router.get('/admin/createAnime/may', verifyTokenAdmin, isAdmin, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/animeMay', { usersesstion, active: 'createAnime-admin' });
});
router.post('/createAnime', verifyTokenAdmin, async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const { nameAnime, Produced, manuscript, episodes, start, linkImage, year, month, season, dub, sub, publicationStartTime  } = req.body;

        const publicationStartUTC = new Date(publicationStartTime).toISOString();
        const newAnime = new Anime({
          nameAnime,
          Produced,
          manuscript,
          episodes,
          start,
          linkImage,
          year,
          month,
          season,
          dub,
          sub,
          publicationStartTime: publicationStartUTC
        });

        const author = {
            id: usersesstion._id,
            username: usersesstion.username,
            profile: usersesstion.profile
        };

        newAnime.author = author;
        await newAnime.save();
        console.log(newAnime)
        res.status(201).send('บันทึกข้อมูลอนิเมะสำเร็จ');
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/createAnime/may', createAnime.Addanimemay);

async function loadAnimeData(req, res, next) {
    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril');
        req.AnimeBordData = AnimeBordData;
        next();
    } catch (error) {
        next(error);
    }
}

router.get('/edit/anime/boards', loadAnimeData, async (req, res) => {
    const usersesstion = req.session.userlogin;

    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril animeMay animeJune animeJuly animeOctober');
        if (!AnimeBordData) {
            return res.status(404).json({ error: "AnimeBordData not found" });
        }

        res.render('./admin/edits/adminboards', { usersesstion, AnimeBordData,active: 'createAnime-admin' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
router.get('/anime/animebrowse/edit', loadAnimeData, async (req, res) => {
    const usersesstion = req.session.userlogin;

    try {
        const AnimeData = await Anime.find();
        if (!AnimeData) {
            return res.status(404).json({ error: "AnimeData not found" });
        }

        res.render('./admin/edits/Editanimebrowse', { usersesstion, AnimeData,active: 'createAnime-admin' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post('/edit_Anime/browse', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const edit_id = req.body.edit_id;
    try {
        const EditAnime = await Anime.findOne({ _id: edit_id }).exec();

        if (!EditAnime ) {
            return res.status(404).json({ error: "AnimeApril not found" });
        }

        res.render('./admin/edits/animebord', { active: 'dashboard', EditAnime, usersesstion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/edit/character/anime', async (req,res) => {
    const usersesstion = req.session.userlogin;
    const edit_id = req.body.edit_id;
    try {
        const EditAnime = await Anime.findOne({ _id: edit_id }).exec();

        if (!EditAnime ) {
            return res.status(404).json({ error: "Anime not found" });
        }
        res.render('./admin/edits/Addcharacter', { active: 'dashboard', usersesstion, EditAnime})
    } catch (err) {
        console.log(err)
    }
})

router.post('/edit_Anime/character/add', async (req, res) => {
    try {
        const { animeId, namevoice, voiceimage, character, role, characterimage, dubType } = req.body;
        const anime = await Anime.findById(animeId);

        if (!anime) {
            return res.status(404).send('Anime not found');
        }

        const newCharacter = { namevoice, voiceimage, character, role, characterimage };
        
        if (dubType === 'dubjpan') {
            anime.Dubbings.dubjpan.push(newCharacter);
        } else if (dubType === 'dubthai') {
            anime.Dubbings.dubthai.push(newCharacter);
        } else {
            return res.status(400).send('Invalid dub type');
        }

        await anime.save();
        console.log(anime)
        res.redirect('/anime/animebrowse/edit');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/edit_animeboard/may', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const edit_id = req.body.edit_id;
    try {
        const animeMay = await Animemay.findOne({ _id: edit_id }).exec();

        if (!animeMay) {
            return res.status(404).json({ error: "AnimeApril not found" });
        }

        res.render('./admin/edits/animeMay', { active: 'dashboard', animeMay, usersesstion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post('/edit_animeboard/July', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const edit_id = req.body.edit_id;
    try {
        const animeJuly = await AnimeJuly.findOne({ _id: edit_id }).exec();

        if (!animeJuly) {
            return res.status(404).json({ error: "AnimeApril not found" });
        }

        res.render('./admin/edits/2024/animeJuly', { active: 'dashboard', animeJuly, usersesstion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post('/edit_animeboard/June', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const edit_id = req.body.edit_id;
    try {
        const animejune = await AnimeJune.findOne({ _id: edit_id }).exec();

        if (!animejune) {
            return res.status(404).json({ error: "AnimeApril not found" });
        }

        res.render('./admin/edits/2024/animeJune', { active: 'dashboard', animejune, usersesstion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/edit_Anime/browse/update', verifyToken, async (req, res) => {
    const update_id = req.body.update_id;
    try {
        const animebrowse = await Anime.findOne(
            { _id: update_id } );
        if (!animebrowse) {
            return res.status(404).json({ error: "animebrowse not found" });
        }

        const publicationStartUTC = new Date(req.body.publicationStartTime).toISOString();

        animebrowse.nameAnime = req.body.nameAnime;
        animebrowse.Produced = req.body.Produced;
        animebrowse.manuscript = req.body.manuscript;
        animebrowse.episodes = req.body.episodes;
        animebrowse.start = req.body.start;
        animebrowse.linkImage = req.body.linkImage;
        animebrowse.Imagebackgroud = req.body.Imagebackgroud;
        animebrowse.web = req.body.web;
        animebrowse.Synopsis = req.body.Synopsis;
        animebrowse.bilibili = req.body.bilibili;
        animebrowse.nameep = req.body.nameep;
        animebrowse.netflix = req.body.netflix;
        animebrowse.Iqiyi = req.body.Iqiyi;
        animebrowse.youtube = req.body.youtube;
        animebrowse.yt_text = req.body.yt_text;
        animebrowse.crunchyroll = req.body.crunchyroll;
        animebrowse.linkdemo = req.body.linkdemo;
        animebrowse.platforms = req.body.platforms;
        animebrowse.publicationStartTime = publicationStartUTC

        await animebrowse.save();
        // console.log(animebrowse)

        res.redirect('/admin/dash?alertMessageVideo=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit_animeboard/May/002', verifyToken, createAnime.EditanimeMay);
router.post('/edit_animeboard/EditanimeJuly', verifyToken, createAnime.EditanimeJuly);
router.post('/edit_animeboard/Edit/anime/June', verifyToken, createAnime.EditanimeJune);
router.post('/edit_animeboard/Edit/anime/October', verifyToken, createAnime.EditanimeOctober);
router.post('/editvideo/post/videoid', verifyToken, createAnime.Editvideos);


router.get('/success', (req, res) => {
    res.render('success')
})

router.use(create_2024);
router.use(Admin_Router); 

module.exports = router