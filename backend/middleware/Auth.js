const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const UnauthorizedError = require('../../errors/unauthorized')

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization
    let token

    if(authHeader && authHeader.startsWith('Bearer ')) {
        try {
            // get token from header
            token = authHeader.split(' ')[1]
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // get user from token
            req.user = await User.findById(decoded.id).select('-password')

        next()
        } catch (error) {
          throw new UnauthorizedError('Hiányzó jogosultság.')
        }
    }
    if(!token) {
          throw new UnauthorizedError('Hiányzó jogosultság.')
    }
}

module.exports = { authenticate }
