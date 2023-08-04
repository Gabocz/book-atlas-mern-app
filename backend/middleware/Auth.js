const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const CustomError = require('../../errors')

const authenticateUser = async (req, res, next) => {
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
          throw new CustomError.UnauthenticatedError('Érvénytelen hitelesítés.')
        }
    }
    if(!token) {
        throw new CustomError.UnauthenticatedError('Érvénytelen hitelesítés.')
    }
}

module.exports = authenticateUser
