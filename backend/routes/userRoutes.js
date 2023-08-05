const express = require('express')
const router = express.Router()

const {
    registerUser, 
    loginUser, 
    updateUser,
    getUser,
    getAllUsers,
} = require('../controllers/userController')
const { authenticateUser, authorizeUser }  = require('../middleware/Auth')

router.route('/').get(authenticateUser, authorizeUser('admin'), getAllUsers)
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/:id').put(authenticateUser, updateUser)
router.route('/:id').get(getUser)


module.exports = router
