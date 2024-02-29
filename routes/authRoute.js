const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

// /api/auth/register
router.post('/register', authController.registerUser)

// /api/auth/login
router.post('/login', authController.loginUser)

// /api/auth/:userId/verify/:token
router.get('/:userId/verify/:token', authController.verifyUserAccount)


module.exports = router