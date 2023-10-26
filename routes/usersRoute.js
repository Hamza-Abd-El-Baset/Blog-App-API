const express = require('express')
const router = express.Router()
const {getAllUsers, getUser} = require('../controllers/usersController')
const {verifyAdmin} = require('../middlewares/verification')

// /api/users/profile

router.route('/profile')
.get(verifyAdmin, getAllUsers)


// /api/users/profile/:id

router.route('/profile/:id')
.get(getUser)

module.exports = router