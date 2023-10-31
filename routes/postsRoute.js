const router = require('express').Router()
const {verifyLoggedIn, verifyUserId} = require('../middlewares/verification')
const photoUpload = require('../middlewares/photoUpload')
const {createPost} = require('../controllers/postsController')

// /api/posts
/**
* @desc Create new post
* @route /api/posts
* @access private (only logged-in user)
*/
router.route('/')
.post(verifyLoggedIn, photoUpload.single("image"), createPost)

module.exports = router