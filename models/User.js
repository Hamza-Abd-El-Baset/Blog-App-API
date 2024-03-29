const mongoose = require('mongoose')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const passwordComplexity = require('joi-password-complexity')


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
            publicId: null
        }
    },
    bio: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

//Connecting between User and Post model
userSchema.virtual("posts",{
    ref: "Post",
    foreignField: "user",
    localField: "_id"
})

//Generate Auth Token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET, {
        expiresIn: "4h"
    })
}

//User Model
const User = mongoose.model("User", userSchema)

//Validate register user
const validateRegisterUser = (obj) => {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(30).required(),
        email: joi.string().trim().min(5).max(50).required().email(),
        password: passwordComplexity().required(), 
    })
    return schema.validate(obj)
}

//Validate update user
const validateUpdateUser = (obj) => {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(30),
        password: passwordComplexity(),
        bio: joi.string()
    })
    return schema.validate(obj)
}

//Validate Email
const validateEmail = (obj) => {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(50).required().email(),
    })
    return schema.validate(obj)
}

//Validate New Password
const validateNewPassword = (obj) => {
    const schema = joi.object({
        password: passwordComplexity().required(),
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    validateRegisterUser,
    validateUpdateUser,
    validateEmail,
    validateNewPassword
}