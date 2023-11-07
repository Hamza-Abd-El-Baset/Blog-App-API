const router = require('express').Router()
const {createPost, getAllPosts, getSinglePost, updatePost, getPostsCount, deletePost, toggleLike} = require('../controllers/postsController')
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
* @route /api/posts/count
*/
router.route('/count')
.get(getPostsCount)


/**
* @route /api/posts/:id
*/
router.route('/:id')
.get(validateObjectId, getSinglePost)
.delete(validateObjectId, verifyLoggedIn, deletePost)
.put(validateObjectId, verifyLoggedIn, photoUpload.single("image"), updatePost)


/**
* @route /api/posts/:id/like
*/
router.route('/:id/like')
.put(validateObjectId, verifyLoggedIn, toggleLike)

module.exports = router