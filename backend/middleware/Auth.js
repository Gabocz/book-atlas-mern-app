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
            const testUser = decoded.userId === '64d669a4c0a4f61936a0d135'
            // get user from token
            const user = await User.findById(decoded.userId).select('-password')
            req.user = user
            req.user.testUser = testUser
        next()
        } catch (error) {
          throw new CustomError.UnauthenticatedError('Érvénytelen hitelesítés.')
        }
    }
    if(!token) {
        throw new CustomError.UnauthenticatedError('Érvénytelen hitelesítés.')
    }
}

    const authorizeUser = (...roles) => {
        return (req, res, next) => {
            if(!roles.includes(req.user.role)) {
              throw new CustomError.UnauthorizedError('Hozzáférés megtagadva.')
            }
            next()
        }
    }

module.exports = {
    authenticateUser,
    authorizeUser
}
