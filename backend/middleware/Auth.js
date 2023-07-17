const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const UnauthorizedError = require('../../errors/unauthorized')

const authorize = async (req, res, next) => {
    const authHeader = req.headers.authorization
    let token

    if(authHeader && authHeader.startsWith('Bearer ')) {
        try {
            // get token from header
            token = authHeader.split(' ')[1]
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // get user from token
            const user = await User.findById(decoded.userId).select('-password')
            req.user = user
        next()
        } catch (error) {
          throw new UnauthorizedError('Hiányzó jogosultság.')
        }
    }
    if(!token) {
          throw new UnauthorizedError('Hiányzó jogosultság.')
    }
}

module.exports = { authorize }
