const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/Auth')
const multer = require('multer')
const { sendUploadToGCS } = require('../middleware/upload')
// const path = require('path')

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
//   }
// })

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



router.route('/').post(authenticate, upload.array('image', 3), sendUploadToGCS, registerBook).get(getBooks)
router.route('/search').get(searchBooks)
router.route('/user/:id').get(authenticate, getAllBooksByUser).put(authenticate, updateBook)
router.route('/:id').get(getBook).put(authenticate, upload.array('image', 3), sendUploadToGCS, updateBook).delete(authenticate, deleteBook)

module.exports = router
