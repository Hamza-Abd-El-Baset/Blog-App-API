const express = require('express')
const router = express.Router()
const {getAllUsers, getUser, updateUser, uploadProfilePhoto, getUsersCount, deleteUser} = require('../controllers/usersController')
const {verifyLoggedIn, verifyAdmin, verifyUserId, verifyUserIdOrAdmin} = require('../middlewares/verification')
const validateObjectId = require('../middlewares/validateObjectId.js')
const photoUpload = require('../middlewares/photoUpload')

/**
* @desc Get all user profiles (admin only)
* @route /api/users/profile
*/
router.route('/profile')
.all(verifyLoggedIn)
.get(verifyAdmin, getAllUsers)

/**
* @desc Get and Update user's profile by id
* @route /api/users/profile/:id
*/
router.route('/profile/:id')
.get(validateObjectId, getUser)
.put(validateObjectId, verifyLoggedIn, verifyUserId, updateUser)
.delete(validateObjectId, verifyLoggedIn, verifyUserIdOrAdmin, deleteUser)


/**
* @desc Upload user profile photo (logged-in users only)
* @route /api/users/profile/profilePhoto
*/
router.route('/profile/profilePhoto')
.post(verifyLoggedIn, photoUpload.single("image"), uploadProfilePhoto)


/**
* @desc Get the count of users (admin only)
* @route /api/users/count
*/
router.route('/count')
.all(verifyLoggedIn)
.get(verifyAdmin, getUsersCount)

module.exports = router