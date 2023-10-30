const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

const {User, validateRegisteredUser} = require("../models/User")


/**----------------------------------
 * @desc Register New User
 * @route /api/auth/register
 * @method POST
 * @access public
 --------------------------------------------*/
 module.exports.registerUser = asyncHandler(async (req, res) => {
    
    //Validate registered user
    const {error} = validateRegisteredUser(req.body)
    if(error) {
        return res.status(400).json({message: error.details[0].message})
    }

    //Check if user already exists
    let user = await User.findOne({$or: [
        {username:req.body.username},
        {email:req.body.email},
    ]})
    if(user) {
        return res.status(400).json({message: "User already exists"})
    }
    
    //Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Create the user and save it in the database
    user = new User({
        ...req.body,
        password: hashedPassword
    })
    await user.save()

    // @todo - send verfication email

    //Send response to the client
    res.status(201).json({message: "You registered successfully. Please, log in"})
 })


 /**----------------------------------
 * @desc Login to User
 * @route /api/auth/register
 * @method POST
 * @access public
 --------------------------------------------*/
 module.exports.loginUser = asyncHandler(async (req, res) => {
    
    //Check if user exists
    const user = await User.findOne({$or: [
        {username:req.body.username},
        {email:req.body.email},
    ]})
    if(!user) {
        return res.status(400).json({message: "Invalid username or password"})
    }
    
    //Check the password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
    if(!isPasswordMatch) {
        return res.status(400).json({message: "Invalid username or password"})
    }

    // @todo - send verfication email

    //Generate Token
    const token = user.generateAuthToken()

    //Send response to the client
    res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        token
    })
 })
