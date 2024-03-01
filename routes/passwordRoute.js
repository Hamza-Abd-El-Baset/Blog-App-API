const router = require('express').Router()
const passwordController = require('../controllers/passwordController')

/**
* @route /api/password/reset-password-link
*/
router.post('/reset-password-link', passwordController.sendResetPasswordLink)


/**
* @route /api/password/reset-password/:userId/:token
*/
router.route('/reset-password/:userId/:token')
.get(passwordController.getResetPasswordLink)
.post(passwordController.resetPassword)


module.exports = router