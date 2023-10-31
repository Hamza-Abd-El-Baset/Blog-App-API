const router = require('express').Router()
const {verifyLoggedIn, verifyUserId} = require('../middlewares/verification')
const photoUpload = require('../middlewares/photoUpload')
const {createPost} = require('../controllers/postsController')

router.route('/')
.post(verifyLoggedIn, photoUpload.single("image"), createPost)

module.exports = router