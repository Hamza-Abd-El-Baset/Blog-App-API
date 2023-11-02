const router = require('express').Router()
const {createPost, getAllPosts, getSinglePost, updatePost, getPostsCount, deletePost} = require('../controllers/postsController')
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
//Must change verify user id to verify post user id
// Can also merge loggedin and verifyUserId to be verify logged-in user id
// and verify isAdmin to be verify logged in user isAdmin
//or ask chatGPT about naming convention
//.put(verifyLoggedIn, verifyUserId, photoUpload.single("image"), updatePost)
//check functionality of updatePost, especially updating image and assuring it is optional



module.exports = router