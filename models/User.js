const mongoose = require('mongoose')
const joi = require('joi')
const jwt = require('jsonwebtoken')

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
        maxlength: 50
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
    timestamps: true
})

//Generate Auth Token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET, {
        expiresIn: "4h"
    })
}

//User Model
const User = mongoose.model("User", userSchema)

//Validate Registered User
const validateUser = (obj) => {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(30).required(),
        email: joi.string().trim().min(5).max(50).required().email(),
        password: joi.string().trim().min(8).required()
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    validateUser
}