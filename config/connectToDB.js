const  mongoose = require("mongoose");

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB successfully ^_^")
    }
    catch(error) {
        console.log("Failed to connect to MongoDB", error)
    }
}