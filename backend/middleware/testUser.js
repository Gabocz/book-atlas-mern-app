const CustomError = require('../../errors')

const testUser = (req, res, next) =>{
    if(req.user.testUser) {
        throw new CustomError.BadRequestError('Tesztfelhasználó! Csak olvasásra!') 
    }
    next()
}

module.exports = testUser
