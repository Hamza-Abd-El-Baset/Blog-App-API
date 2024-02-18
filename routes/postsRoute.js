const router = require('express').Router()
const postsController = require('../controllers/postsController')
const {verifyLoggedIn, verifyUserId} = require('../middlewares/verification')
const photoUpload = require('../middlewares/photoUpload')
const validateObjectId = require('../middlewares/validateObjectId')


/**
* @route /api/posts
*/
router.route('/')
.post(verifyLoggedIn, photoUpload.single("image"), postsController.createPost)
.get(postsController.getAllPosts)


/**
* @route /api/posts/count
*/
router.route('/count')
.get(postsController.getPostsCount)


/**
* @route /api/posts/:id
*/
router.route('/:id')
.get(validateObjectId, postsController.getSinglePost)
.delete(validateObjectId, verifyLoggedIn, postsController.deletePost)
.put(validateObjectId, verifyLoggedIn, photoUpload.single("image"), postsController.updatePost)


/**
* @route /api/posts/:id/like
*/
router.route('/:id/like')
.put(validateObjectId, verifyLoggedIn, postsController.toggleLike)

module.exports = router