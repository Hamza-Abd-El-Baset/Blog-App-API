const mongoose = require('mongoose')
const joi = require('joi')

const categorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Category = mongoose.model("Category", categorySchema)

const validateCreateCategory = (obj) => {
    const schema = joi.object({
        title: joi.string().trim().required().label('Title')
    })
    return schema.validate(obj)
}

module.exports = {
    Category,
    validateCreateCategory
}