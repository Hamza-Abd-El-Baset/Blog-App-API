const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController.js')
const {verifyLoggedIn, verifyAdmin, verifyUserId, verifyUserIdOrAdmin} = require('../middlewares/verification.js')
const validateObjectId = require('../middlewares/validateObjectId.js')
const photoUpload = require('../middlewares/photoUpload.js')

/**
* @desc Get all user profiles (admin only)
* @route /api/users/profile
*/
router.route('/profile')
.all(verifyLoggedIn)
.get(verifyAdmin, usersController.getAllUsers)

/**
* @desc Get and Update user's profile by id
* @route /api/users/profile/:id
*/
router.route('/profile/:id')
.get(validateObjectId, usersController.getUser)
.put(validateObjectId, verifyLoggedIn, verifyUserId, usersController.updateUser)
.delete(validateObjectId, verifyLoggedIn, verifyUserIdOrAdmin, usersController.deleteUser)


/**
* @desc Upload user profile photo (logged-in users only)
* @route /api/users/profile/profilePhoto
*/
router.route('/profile/profilePhoto')
.post(verifyLoggedIn, photoUpload.single("image"), usersController.uploadProfilePhoto)


/**
* @desc Get the count of users (admin only)
* @route /api/users/count
*/
router.route('/count')
.all(verifyLoggedIn)
.get(verifyAdmin, usersController.getUsersCount)

module.exports = router