const asyncHandler =require('express-async-handler')
const bcrypt = require('bcryptjs')
const {User, validateUpdateUser} = require('../models/User')
const {Post} = require("../models/Post")
const {Comment} = require("../models/Comment")
const path = require('path')
const fs = require('fs')
const { cloudinaryUploadFile, cloudinaryRemoveFile, cloudinaryRemoveMultipleFiles} = require('../utils/cloudinary')
const { post } = require('../routes/postsRoute')

/**
 * @desc Get all users profile
 * @route /api/users/profile
 * @method GET
 * @access private (only admin)
 */
module.exports.getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select('-password').populate("posts")
    res.status(200).json(users)
})


/**
 * @desc Get users count
 * @route /api/users/count
 * @method GET
 * @access private (only admin)
 */
module.exports.getUsersCount = asyncHandler(async (req, res) => {

    const usersCount = await User.count()
    res.status(200).json({usersCount})
})


/**
 * @desc Get user profile by id
 * @route /api/users/profile/:id
 * @method GET
 * @access public
 */
module.exports.getUser = asyncHandler(async (req, res) => {

    const {id} = req.params
    const user = await User.findById(id).select("-password").populate("posts")

    if(!user) {
        return res.status(404).json({message: "User not found"})
    }

    res.status(200).json(user)
})

/**
 * @desc Update user profile by id
 * @route /api/users/profile/:id
 * @method PUT
 * @access private (only user himself)
 */
module.exports.updateUser = asyncHandler(async (req, res) => {

    const userUpdate = req.body

    //Validate update
    const {error} = validateUpdateUser(userUpdate)

    if(error) {
        return res.status(400).json({message: error.details[0].message})
    }

    //Check if username already exists
    let existingUser = await User.findOne({username: userUpdate.username})

    if(existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({message: "Username already exists"})
    }

    //Hashing password if exists
    if(userUpdate.password) {
        const salt = bcrypt.genSalt(10)
        userUpdate.password = bcrypt.hash(userUpdate.password, salt)
    }

    //Updating user and sending response with updated user to the Client
    const {id} = req.params
    const updatedUser = await User.findByIdAndUpdate(id, userUpdate, {
        new: true
    }).select('-password')
    .populate("posts")
    
    res.status(200).json(updatedUser)
})


/**
 * @desc Upload user profile photo
 * @route /api/users/profile/profilePhoto
 * @method POST
 * @access private (only logged-in user)
 */
module.exports.uploadProfilePhoto = asyncHandler(async (req, res) => {
    // 1. Validation
    if(!req.file) {
        return res.status(400).json({message: "No image file provided"})
    }

    // 2. Get the path to the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    
    // 3. Upload to cloudinary
    const uploadResult = await cloudinaryUploadFile(imagePath)

    // 4. Get the user from DB
    const user = await User.findById(req.user.id)

    // 5. Delete the old profile photo if exists
    if(user.profilePhoto.publicId) {
        await cloudinaryRemoveFile(user.profilePhoto.publicId)
    }

    // 6. Change the profilePhoto field in the DB
    user.profilePhoto = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url
    }
    await user.save()

    // 7. Send response to the client
    res.status(200).json({
        message: "Profile photo is uploaded successfully",
        profilePhoto: {
            publicId: uploadResult.public_id,
            url: uploadResult.secure_url
        }
    })

    // 8. Remove the image from the server
    fs.unlinkSync(imagePath)
})


/**
 * @desc Delete user profile (account)
 * @route /api/users/profile/:id
 * @method DELETE
 * @access private (only admin or user himself)
 */
module.exports.deleteUser = asyncHandler(async (req, res) => {
    // 1. Get the user from DB
    const user = await User.findById(req.params.id)
    if(!user) {
        return res.status(404).json({message: "User not found"})
    }

    // 2. Delete all posts images from cloudinary that belongs to this user

    const posts = await Post.find({user: user._id})
    
    if(posts.length > 0) {
        const publicIds = posts.map(post => post.image.publicId)
        await cloudinaryRemoveMultipleFiles(publicIds)
    }

    
    // 3. Delete the profile picture from cloudinary
    if(user.profilePhoto.publicId) {
        await cloudinaryRemoveFile(user.profilePhoto.publicId)
    }

    // 4. Delete user posts and comments
    await Post.deleteMany({user: user._id})
    await Comment.deleteMany({user: user._id})
    
    // 5. Delete the user himself
    await User.findByIdAndDelete(req.params.id)

    // 6. Send response to the client
    res.status(200).json({message: "The profile has been deleted"})
})
