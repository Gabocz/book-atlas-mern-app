const express = require('express')
const router = express.Router()

const {
    registerUser, 
    loginUser, 
    updateUser,
    getUser,
} = require('../controllers/userController')
const { authorize } = require('../middleware/Auth')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/:id').put(authorize, updateUser)
router.route('/:id').get(getUser)


module.exports = router
