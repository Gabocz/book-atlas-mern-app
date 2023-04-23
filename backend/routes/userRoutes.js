const express = require('express')
const router = express.Router()

const {
    registerUser, 
    loginUser, 
    updateUser,
    getUser,
} = require('../controllers/userController')
const { authenticate } = require('../middleware/Auth')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/:id').put(authenticate, updateUser)
router.route('/:id').get(getUser)


module.exports = router
