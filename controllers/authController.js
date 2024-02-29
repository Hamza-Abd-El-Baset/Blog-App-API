const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const ms = require('ms')
const {User, validateRegisterUser} = require("../models/User")
const VerificationToken = require('../models/VerificationToken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')


/**----------------------------------
 * @desc Register New User
 * @route /api/auth/register
 * @method POST
 * @access public
 --------------------------------------------*/
 module.exports.registerUser = asyncHandler(async (req, res) => {
    
    //Validate registered user
    const {error} = validateRegisterUser(req.body)
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

    // Creating new VerificationToken & saving it to DB
    const verificationToken = new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
        expiresAt: new Date(Date.now() + ms("30m")),  
    })

    await verificationToken.save()
    
    // Making the link
    const link = `${process.env.FRONTEND_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`

    // Putting the link into an html template
    const htmlTemplate = `
        <div>
            <p>Click on the link below to verify your email</p>
            <a href="${link}">Verify</a>
        </div>
    
    `

    // Sending email to the user
    await sendEmail(user.email, "Blog Account Verification", htmlTemplate) 

    //Send response to the client
    res
    .status(201)
    .json({message: "A verification email has been sent to you. Please, check your inbox"})
})


 /**----------------------------------
 * @desc Login to User
 * @route /api/auth/login
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

    // Send verfication email
    if(!user.isAccountVerified) {

        let verificationToken = await VerificationToken.findOne({
            userId: user._id
        })

        if(!verificationToken) {
            verificationToken = new VerificationToken({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
                expiresAt: new Date(Date.now() + ms("30m")),  
            })

            await verificationToken.save()
        }       
        
        const link = `${process.env.FRONTEND_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`

        const htmlTemplate = `
            <div>
                <p>Click on the link below to verify your email</p>
                <a href="${link}">Verify</a>
            </div>
        
        `
        await sendEmail(user.email, "Blog Account Verification", htmlTemplate) 


        return res
        .status(400)
        .json({message: "A verification email has been sent to you. Please, check your inbox"})
    }

    //Generate Token
    const token = user.generateAuthToken()

    //Send response to the client
    res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        token,
        username: user.username
    })
 })

 /**----------------------------------
 * @desc Verify User Account
 * @route /api/auth/:userId/verify/:token
 * @method GET
 * @access public
 --------------------------------------------*/
 module.exports.verifyUserAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId)
    if(!user) {
        return res.status(400).json({message: "invalid link"})
    }
    
    const verificationToken = await VerificationToken.findOne({
        userId: user._id,
        token: req.params.token,
    })

    if(!verificationToken) {
        return res.status(400).json({message: "invalid link"})
    }

    // Check if the token has expired
    if (verificationToken.expiresAt && verificationToken.expiresAt < Date.now()) {
        await VerificationToken.deleteOne({_id : verificationToken._id}); // Delete the expired token
        return res.status(400).json({ message: "Token has expired" });
    }

    user.isAccountVerified = true
    await user.save()

    res.status(200).json({ message: "Your account has been verified successfully"})
 })
