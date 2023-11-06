const mongoose = require('mongoose')
const joi = require('joi')

//Post Schema
const postSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        required: true,
        minlength: 10,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        default: {
            url: "",
            publicId: null
            } 
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

//Relation between posts and comments
postSchema.virtual("comments", {
    ref:"Comment",
    foreignField: "postId",
    localField: "_id"
})

//Post Model
const Post = mongoose.model("Post", postSchema)

//Validate create post
const validateCreatePost = (obj) => {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(100).required(),
        description: joi.string().trim().min(10).required(),
        category: joi.string().required()
    })
    return schema.validate(obj)
}

//Validate update post
const validateUpdatePost = (obj) => {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(100),
        description: joi.string().trim().min(10),
        category: joi.string()
    })
    return schema.validate(obj)
}


module.exports = {
    Post,
    validateCreatePost,
    validateUpdatePost
}