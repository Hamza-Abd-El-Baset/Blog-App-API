const router = require('express').Router()
const {createPost, getAllPosts, getSinglePost} = require('../controllers/postsController')
const {verifyLoggedIn, verifyUserId} = require('../middlewares/verification')
const photoUpload = require('../middlewares/photoUpload')
const validateObjectId = require('../middlewares/validateObjectId')


/**
* @route /api/posts
*/
router.route('/')
.post(verifyLoggedIn, photoUpload.single("image"), createPost)
.get(getAllPosts)



/**
* @route /api/posts/:id
*/
router.route('/:id')
.get(validateObjectId, getSinglePost)

module.exports = router