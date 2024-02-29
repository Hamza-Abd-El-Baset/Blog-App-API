const cron = require('node-cron')
const asyncHandler = require('express-async-handler')
const VerificationToken = require('./models/VerificationToken')

const deleteExpiredTokens = async () => {
    try {
        const expiredTokens = await VerificationToken.deleteMany({ expiresAt: { $lt: new Date() } })
        console.log(`Deleted ${expiredTokens.deletedCount} expired tokens.`)
    } catch (error) {
        console.error('Error deleting expired tokens:', error)
        throw new Error('Error deleting expired tokens')
    }
};

// Wrap the deleteExpiredTokens function with asyncHandler
const deleteExpiredTokensHandler = asyncHandler(async () => {
    console.log('Running task to delete expired tokens...');
    await deleteExpiredTokens();
});

// Schedule the asyncHandler-wrapped function to run every hour
cron.schedule('0 * * * *', deleteExpiredTokensHandler);
