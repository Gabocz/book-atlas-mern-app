const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middleware/Auth')
const multer = require('multer')
const { sendUploadToGCS } = require('../middleware/upload')
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: 1024 * 1024
})

const {
    registerBook, 
    getBooks, 
    getAllBooksByLoggedInUser, 
    getAllBooksByUser,
    searchBooks, 
    updateBook,
    deleteBook,
    getBook,
} = require('../controllers/bookController')



router.route('/').post(authenticateUser, upload.array('image', 3), sendUploadToGCS, registerBook).get(getBooks)
router.route('/search').get(searchBooks)
router.route('/user/:id').get(getAllBooksByUser)
router.route('/user/:id').get(authenticateUser, getAllBooksByLoggedInUser).put(authenticateUser, updateBook)
router.route('/:id').get(getBook).put(authenticateUser, upload.array('image', 3), sendUploadToGCS, updateBook).delete(authenticateUser, deleteBook)

module.exports = router
