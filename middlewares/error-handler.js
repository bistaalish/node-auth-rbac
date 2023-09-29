const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let CustomError = {
    // Set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong"
  }
  if(err.message ===  "Cannot read properties of undefined (reading '0')"){
    CustomError.statusCode = StatusCodes.UNAUTHORIZED
    CustomError.msg = 'Password must be at least 8 characters long and contain at least one letter, one number, and may include special characters like @$!%*#?&.'
  }
  if(err.name === "ValidationError"){
    CustomError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
    CustomError.statusCode = StatusCodes.BAD_REQUEST
  }
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ message: err.message })
  }
  if(err.code && err.code === 11000 ) {
    CustomError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    CustomError.statusCode = 409    
  }
  if(err.name === 'CastError'){
    CustomError.msg = `No item found with id : ${err.value}`
    CustomError.statusCode = StatusCodes.NOT_FOUND
  }
  return res.status(CustomError.statusCode).json({ message: CustomError.msg })
}

module.exports = errorHandlerMiddleware
