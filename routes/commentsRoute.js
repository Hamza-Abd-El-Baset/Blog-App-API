
const router = require('express').Router()

const { verifyLoggedIn, verifyAdmin } = require('../middlewares/verification')
const commentsController = require('../controllers/commentsController')
const validateObjectId = require('../middlewares/validateObjectId')

/**
 * @route /api/comments
 */
router.route('/')
.post(verifyLoggedIn, commentsController.createComment)
.get(verifyLoggedIn, verifyAdmin, commentsController.getAllComments)

/**
 * @route /api/comments/:id
 */
router.route('/:id')
.delete(validateObjectId, verifyLoggedIn, commentsController.deleteComment)

module.exports = router