const CustomAPIError = require('../../errors/custom-error')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)
  if (err instanceof CustomAPIError) {
    return res
      .status(err.statusCode)
      .json({ 
        msg: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
     })
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send('Hiba történt. Próbáld újra.')
}

module.exports = errorHandlerMiddleware




