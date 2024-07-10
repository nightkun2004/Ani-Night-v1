const Acticle = require("../models/acticle")
const User = require("../models/user")
const HttpError = require("../models/errorModel")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")

// ============================= LIKE Post
// METHOT : /api/v1/posts/:id
const likePost = async (req, res, next) => {
  try {
    // รับค่าจาก query ?lang=th&id=668d4f684f9d7d43cd4311af
    const id  = req.query; 
    const userId = req.user._id;

    const post = await Acticle.findById(id);
    if (!post) {
      return next(new HttpError("โพสต์ไม่พบ", 404));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("ผู้ใช้ไม่พบ", 404));
    }

    // Check if user has already liked the post
    const hasLiked = post.likes.includes(userId);

    let message;
    if (hasLiked) {
      // Remove like
      post.likes = post.likes.filter(like => like.toString() !== userId);
      post.likesCount--;
      message = "ยกเลิกไลค์โพสต์แล้ว";
    } else {
      // Add like
      post.likes.push(userId);
      post.likesCount++;
      message = "ไลค์โพสต์แล้ว";
    }

    post.likesCount = post.likes.length;

    await post.save();

    res.status(200).json({
      message: hasLiked ? "ยกเลิกไลค์โพสต์แล้ว" : "ไลค์โพสต์แล้ว",
      likesCount: post.likesCount
    });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
}
const UploadImagesArticle = async (req, res, next) => {
  try {
    if (!req.files || !req.files.images || !req.files.thumbnail) {
      return res.status(400).send('No files were uploaded.');
    }

    const images = req.files.images; // ภาพประกอบหลายไฟล์
    const thumbnail = req.files.thumbnail; // ภาพปก

    // ฟังก์ชันเพื่อสร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำกัน
    const generateFilename = (file) => {
      let fileName = file.name;
      let splittedFilename = fileName.split('.');
      return splittedFilename[0] + crypto.randomUUID() + "." + splittedFilename[splittedFilename.length - 1];
    };

    // อัปโหลดภาพประกอบ
    let imageUrls = [];
    if (Array.isArray(images)) {
      for (let image of images) {
        let newFilename = generateFilename(image);
        let uploadPath = path.join(__dirname, '..', 'src', 'public', 'ArticlesImages_mord', newFilename);
        await image.mv(uploadPath);
        imageUrls.push(`/src/public/ArticlesImages_mord/${newFilename}`);
      }
    } else {
      let newFilename = generateFilename(images);
      let uploadPath = path.join(__dirname, '..', 'src', 'public', 'ArticlesImages_mord', newFilename);
      await images.mv(uploadPath);
      imageUrls.push(`/src/public/ArticlesImages_mord/${newFilename}`);
    }

    // อัปโหลดภาพปก
    let thumbnailFilename = generateFilename(thumbnail);
    let thumbnailUploadPath = path.join(__dirname, '..', 'src', 'public', 'acticles_images', thumbnailFilename);
    await thumbnail.mv(thumbnailUploadPath);

    res.json({
      thumbnailUrl: `/src/public/ArticlesImages_mord/${thumbnailFilename}`,
      imageUrls: imageUrls
    });

  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const CreateArticle = async (req, res, next) => {
  const usersesstion = req.session.userlogin;
  try {
    const { name, tags, content, username, categories, link, link_info, iduser, published, createdAt } = req.body;
    const { thumbnail, images } = req.files;
    console.log('Categories:', categories);

    if (!thumbnail) {
      return next(new HttpError("No thumbnail uploaded.", 422));
    }

    if (!images || images.length === 0) {
      return next(new HttpError("No images uploaded.", 422));
    }

    const tagsArray = tags ? tags.split('#').map(tag => tag.trim()).filter(tag => tag) : [];

    let postId = crypto.randomUUID();

    // อัปโหลดภาพปก
    let thumbnailFilename = generateFilename(thumbnail);
    let thumbnailUploadPath = path.join(__dirname, '..', 'src', 'public', 'acticles_images', thumbnailFilename);
    await thumbnail.mv(thumbnailUploadPath);

    // อัปโหลดภาพประกอบ
    let imageUrls = [];
    if (Array.isArray(images)) {
      for (let image of images) {
        let newFilename = generateFilename(image);
        let uploadPath = path.join(__dirname, '..', 'src', 'public', 'ArticlesImages_mord', newFilename);
        await image.mv(uploadPath);
        imageUrls.push(`${newFilename}`);
      }
    } else {
      let newFilename = generateFilename(images);
      let uploadPath = path.join(__dirname, '..', 'src', 'public', 'ArticlesImages_mord', newFilename);
      await images.mv(uploadPath);
      imageUrls.push(`${newFilename}`);
    }

    const postcreate = {
      title: name,
      content: content,
      username: username,
      categories: Array.isArray(categories) ? categories : [categories],
      tags: tagsArray,
      photo: `${thumbnailFilename}`, // ภาพ thumbnail
      images: imageUrls, // ภาพประกอบหลายไฟล์
      link: link,
      link_info: link_info,
      url: postId,
      iduser: iduser,
      profile: usersesstion.profile,
      published: published ? published : true,
      author: {
        id: usersesstion._id,
        username: usersesstion.username,
        profile: usersesstion.profile
      },
      createdAt: createdAt ? new Date(createdAt) : Date.now()
    };

    // บันทึก postcreate ในฐานข้อมูลของคุณที่นี่
    const Articlesave = new Acticle(postcreate);
    await Articlesave.save();
    await User.findByIdAndUpdate(usersesstion._id, { $push: { acticles: Articlesave._id } }, { new: true });
    res.status(200).redirect('/');
    // res.status(201).json({ message: "Article created successfully", article: postcreate });

  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const generateFilename = (file) => {
  let fileName = file.name;
  let splittedFilename = fileName.split('.');
  return crypto.randomUUID() + "." + splittedFilename[splittedFilename.length - 1];
};

module.exports = { likePost, CreateArticle, UploadImagesArticle }