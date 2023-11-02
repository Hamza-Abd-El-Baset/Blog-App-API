const {Post, validateCreatePost, validateUpdatePost} = require('../models/Post')
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
        title: req.body.title,
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


/**
 * @desc    Get all posts
 * @route   /api/posts
 * @method  GET
 * @access  public
 */
module.exports.getAllPosts = asyncHandler(async (req, res) => {
    const postsPerPage = 3
    const {pageNumber, category} = req.query
    let posts

    if(pageNumber) {
        posts = await Post.find()
        .skip((postsPerPage-1) * pageNumber)
        .limit(postsPerPage)
        .sort({createdAt: -1})
        .populate("user", ["-password"])
    }
    else if(category) {
        posts = await Post.find({category})
        .sort({createdAt: -1})
        .populate("user", ["-password"])
    }
    else {
        posts = await Post.find()
        .sort({createdAt: -1})
        .populate("user", ["-password"])
    }
    res.status(200).json(posts)
})



/**
 * @desc    Get single post
 * @route   /api/posts/:id
 * @method  GET
 * @access  public
 */
module.exports.getSinglePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate("user", ["-password"])
    
    if(!post) {
        return res.json({message: "Post not found"})
    }

    res.status(200).json(post)
})


/**
 * @desc    Get posts count
 * @route   /api/posts/count
 * @method  GET
 * @access  public
 */
module.exports.getPostsCount = asyncHandler(async (req, res) => {
    
    const postsCount = await Post.count()

    res.status(200).json({postsCount})
})


/**
 * @desc    Get single post
 * @route   /api/posts/:id
 * @method  GET
 * @access  public
 */
module.exports.deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    
    if(!post) {
        return res.status(404).json({message: "Post not found"})
    }

    if(req.user.isAdmin || req.user.id === post.user.toString()) {
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryRemoveFile(post.image.publicId)
        
        // @todo -- delete all comments that belongs to this post

        res.status(200).json({
            message: "Post has been deleted successfully",
            postId: post._id
            })
    } else {
        res.status(403).json({message: "Access denied, forbidden"})
    }

        


})


/**
 * @desc    Update post
 * @route   /api/posts/:id
 * @method  POST
 * @access  private (only owner of the post)
*/
module.exports.updatePost = asyncHandler(async (req, res) => {
    
    // 1. Validation for data
    const {error} = validateUpdatePost(req.body)
    if(error) {
        return res.status(400).json({message: error.details[0].message})
    }
    

    // 2. Get post and check if it exists
    const post = await Post.findById(req.params.id)
    if(!post) {
        res.status(404).json({message: "Post not found"})
    }


    // 3. Check if this post belong to the logged-in user
    if(req.user.id !== post.user.toString()) {
        return res.status(403).json({message: "Access denied, forbidden"})
    }


    // 4. Update post
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }).populate("user", ["-password"])

    
    
    // 5. Edit photo if exist
    if(req.file) {
        
        
        // Remove old image
        await cloudinaryRemoveFile(post.image.publicId)
        
        //upload new image
        const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
        const uploadResult = await cloudinaryUploadFile(imagePath)
        
        updatedPost.image = {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id
            }
        updatedPost.save()
        
        // Remove image from the server
        fs.unlinkSync(imagePath)
        
    }
    
    // 6. Send response to the client
    res.status(200).json(updatedPost)
    
})
