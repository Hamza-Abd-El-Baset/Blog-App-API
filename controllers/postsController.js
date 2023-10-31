const {Post, validateCreatePost} = require('../models/Post')
const asyncHandler = require('express-async-handler')

const {cloudinaryUploadFile, cloudinaryRemoveFile} = require('../utils/cloudinary')
const fs = require('fs')
const path = require('path')


/**
 * @desc    Create new post
 * @route   /api/posts
 * @method  POST
 * @access  private (only logged-in user)
 */
module.exports.createPost = asyncHandler(async (req, res) => {
    // 1. Validation for image
    if(!req.file) {
        return res.status(400).json({meassage: "No image provided"})
    }

    // 2. Validation for data
    const {error} = validateCreatePost(req.body)
    if(error) {
        return res.status(400).json({message: error.details[0].message})
    }

    // 3. Upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const uploadResult = await cloudinaryUploadFile(imagePath)

    // 4. Create new post and save it to DB
    const post = await Post.create({
        tiltle: req.body.tiltle,
        description: req.body.description,
        category: req.body.category,
        user: req.user.id,
        image: {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
        }
    })


    // 5. Send response to the client
    res.status(201).json(post)

    // 6. Remove image from the server
    fs.unlinkSync(imagePath)
})
