const Comicposter = require("../models/Comic")
const Chapter = require('../models/Chapter')
const fs = require("fs")

exports.CreateComic = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const comicposter = await Comicposter.find(); 

        res.render('./component/pages/dashboard/Comic', {
            comicposter,
            active: 'Comic',
            usersesstion
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
    }
}

exports.ComicList = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const Comiclists = await Comicposter.find().populate('chapters');

        res.render('./component/pages/dashboard/edits/Comiclists', {
            Comiclists,
            active: 'ComicAll',
            usersesstion
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
    }
}

exports.EditComic = async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const comicId = req.query.comicId;
        const Comiclist = await Comicposter.findById(comicId); 

        res.render('./component/pages/dashboard/edits/AddcomicEp', {
            Comiclist,
            active: 'ComicAll',
            usersesstion
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
    }
}

exports.CreateComicMain = async (req, res) => {
    const { titlecomic, categories, Synopsis } = req.body;
    const usersesstion = req.session.userlogin;

    // ตรวจสอบข้อมูลการเข้าสู่ระบบของผู้ใช้
    if (!usersesstion) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const categoriesArray = Array.isArray(categories) ? categories : (categories ? [categories] : ['ไม่พบหมวดหมู่']);

    const newComic = new Comicposter({
        titlecomic,
        Synopsis,
        author: {
            id: usersesstion._id,
            username: usersesstion.username,
            profile: usersesstion.profile
        },
        categories: categoriesArray
    });

    try {
        if (!req.file) {
            throw new Error('ไม่พบไฟล์โปสเตอร์');
        }

        // Set the poster field in Comicposter
        newComic.poster = req.file.filename;
        await newComic.save();
        res.status(201).json({ message: 'Comic created successfully!', comic: newComic });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.filename);
        }
        res.status(500).json({ message: 'Failed to create comic', error });
    }
}

exports.AddEpcomic = async (req, res) => {
    try {
        const { ep, comicID } = req.body;
        const files = req.files;     

         // ตรวจสอบว่า comicId ถูกส่งมาหรือไม่
         if (!comicID) {
            return res.status(400).json({ message: 'ComicId is required' });
        }

        // ตรวจสอบว่ามีการอัพโหลดไฟล์หรือไม่
        if (!files || !files.length) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // อัพโหลดไฟล์ใน array ลงในฐานข้อมูล
        const pages = files.map(file => file.filename);
        
        const newChapter = new Chapter({
            ep: ep,
            comic: comicID,
            pages: pages
        });

        // บันทึกลงในฐานข้อมูล
        await newChapter.save();

        res.status(201).json({ message: 'Chapter created successfully!', chapter: newChapter });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add chapter');
    }
}
