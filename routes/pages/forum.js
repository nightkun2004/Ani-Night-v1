const express = require("express");
const router = express.Router();
const Forum = require("../../models/forum")
const forumControllter = require("../../controls/forumController")

router.get('/forums', forumControllter.getForummain)

router.post('/post-forum', forumControllter.getPortforum)
router.post('/forum/:forumId/like', forumControllter.getLikeforem)
router.post('/forum/:forumId/bookmark', forumControllter.getBookmark)
router.post('/reply', forumControllter.getForumreply)

module.exports = router