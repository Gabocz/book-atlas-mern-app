const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
 
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Hiba történt. Próbáld újra később.'
  }
  
  if(err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map(item => item.message).join(' ')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if(err.code && err.code === 11000) {
    customError.msg = `A(z) ${err.keyValue.email} email címmel már létezik felhasználó. Használj másik email címet vagy jelentkezz be!`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if(err.name === 'CastError') {
    customError.msg = `A(z) ${err.value} azonosító nem található.`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  return res
    .status(customError.statusCode)
    .json({
      msg: customError.msg,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = errorHandlerMiddleware




