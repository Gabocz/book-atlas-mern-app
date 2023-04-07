const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const authenticate = asyncHandler(async (req, res, next) => {
    console.log(req.headers.authorization)
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // get token from header
            token = req.headers.authorization.split(' ')[1]
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // get user from token
            req.user = await User.findById(decoded.id).select('-password')

        next()
        } catch (error) {
          console.log(error)
          res.status(401)
          throw new Error('Hiányzó jogosultság.')
        }
    }
    if(!token) {
        res.status(401)
          throw new Error('Hiányzó jogosultság.')
    }
})

module.exports = { authenticate }
