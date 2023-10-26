const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types

module.exports = (req, res, next) => {
    
    const {id} = req.params
    if(!ObjectId.isValid(id)) {
        return res.status(400).json({message: "Invalid id"})
    }

    next()
}