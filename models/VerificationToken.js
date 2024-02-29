const mongoose = require('mongoose')

const verificationTokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

const VerificationToken = mongoose.model("VerificationToken", verificationTokenSchema)


module.exports = VerificationToken