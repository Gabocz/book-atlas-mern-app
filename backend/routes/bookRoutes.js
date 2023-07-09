const express = require('express')
const router = express.Router()
const { authorize } = require('../middleware/Auth')
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
    getAllBooksByUser, 
    searchBooks, 
    updateBook,
    deleteBook,
    getBook,
} = require('../controllers/bookController')



router.route('/').post(authorize, upload.array('image', 3), sendUploadToGCS, registerBook).get(getBooks)
router.route('/search').get(searchBooks)
router.route('/user/:id').get(authorize, getAllBooksByUser).put(authorize, updateBook)
router.route('/:id').get(getBook).put(authorize, upload.array('image', 3), sendUploadToGCS, updateBook).delete(authorize, deleteBook)

module.exports = router
