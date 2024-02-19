const cloudinary = require('cloudinary').v2
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const cloudinaryUploadFile = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'auto'
        })
        return result
    }
    catch(error) {
        console.log(error)
        throw new Error("Internal Server Error (Cloudinary)")
    }
}


const cloudinaryRemoveFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    }
    catch(error) {
        console.log(error)
        throw new Error("Internal Server Error (Cloudinary)")
    }
}
const cloudinaryRemoveMultipleFiles = async (publicIds) => {
    try {
        const result = await cloudinary.api.delete_resources(publicIds)
        return result
    }
    catch(error) {
        console.log(error)
        throw new Error("Internal Server Error (Cloudinary)")
    }
}

module.exports = {
    cloudinaryUploadFile,
    cloudinaryRemoveFile,
    cloudinaryRemoveMultipleFiles
}