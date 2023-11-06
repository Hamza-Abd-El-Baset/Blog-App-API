const router = require('express').Router()

const { verifyLoggedIn, verifyAdmin } = require('../middlewares/verification')
const categoriesController = require('../controllers/categoriesController')
const validateObjectId = require('../middlewares/validateObjectId')

/**
 * @route /api/categories
 */
router.route('/')
.post(verifyLoggedIn, verifyAdmin, categoriesController.createCategory)
.get(categoriesController.getAllCategories)


/**
 * @route /api/categories/:id
 */
router.route('/:id')
.delete(validateObjectId, verifyLoggedIn, verifyAdmin, categoriesController.deleteCategory)


module.exports = router