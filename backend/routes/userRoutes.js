const express = require('express')
const router = express.Router()

const {
    registerUser, 
    loginUser, 
    updateUser,
    getSingleUser,
    getAllUsers,
} = require('../controllers/userController')
const { authenticateUser, authorizeUser }  = require('../middleware/Auth')
const testUser = require('../middleware/testUser')

router.route('/').get(authenticateUser, authorizeUser('admin'), getAllUsers)
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/:id').put(authenticateUser, testUser, updateUser)
router.route('/:id').get(getSingleUser)


module.exports = router
