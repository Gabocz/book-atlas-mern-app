const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/Auth')

const {
    registerBook, 
    getAllBooks, 
    getAllBooksByUser, 
    searchBooks, 
    updateBook,
    deleteBook,
    getBook,
} = require('../controllers/bookController')


router.route('/').post(authenticate, registerBook).get(getAllBooks)
router.route('/search').get(searchBooks)
router.route('/user/:id').get(authenticate, getAllBooksByUser).put(authenticate, updateBook).delete(authenticate, deleteBook)
router.route('/:id').get(getBook).put(authenticate, updateBook)

module.exports = router
