const CustomError = require('../../errors')

const checkUserPermissions = (requestUser, resourceUser) => {
    if(requestUser.role === 'admin') return
    if(requestUser.id === resourceUser._id.toString()) return
    throw new CustomError.UnauthorizedError('Hozzáférés megtagadva.')
}

module.exports = checkUserPermissions
