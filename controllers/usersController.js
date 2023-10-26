const asyncHandler =require('express-async-handler')
const {User} = require('../models/User')

/**
 * @desc Get all users profile
 * @route /api/users/profile
 * @method GET
 * @access private (only admin)
 */
module.exports.getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select('-password')
    res.status(200).json(users)
})

/**
 * @desc Get user profile by id
 * @route /api/users/profile/:id
 * @method GET
 * @access public
 */
module.exports.getUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id).select("-password")

    if(!user) {
        return res.status(404).json({message: "User not found"})
    }

    res.status(200).json(user)
})