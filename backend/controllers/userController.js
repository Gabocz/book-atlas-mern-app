const User = require('../models/userModel')
const CustomError = require('../../errors')
const { StatusCodes } = require('http-status-codes')

const registerUser = async(req, res) => {
  const { name, email, password } = req.body

  if(!name || !email || !password) {
    throw new CustomError.BadRequestError('Add meg a neved, az e-mail címed és a jelszavad.')
  }

  const isFirstAccount = await User.countDocuments({}) === 0
  const isAdmin = isFirstAccount

  const user = await User.create({ name, email, password, isAdmin })

  res.status(StatusCodes.CREATED).json({
      id: user._id, 
      name: user.name,
      email: user.email,
      token: user.createJWT()
  })
}

const loginUser = async(req, res) => {
  const { email, password }  = req.body
    
  if(!email|| !password) {
    throw new CustomError.BadRequestError('Add meg az email címet és a jelszót.')
  }
  
  const user = await User.findOne({email})
  
  if(!user) {
    throw new CustomError.UnauthenticatedError('Érvénytelen hitelesítés.')
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if(!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Érvénytelen hitelesítés.')
  }

  res.status(StatusCodes.OK).json({
    id: user._id, 
    name: user.name,
    email: user.email,
    token: user.createJWT()
  })
} 


const updateUser = async(req, res) => {
  const { name, email }  = req.body
  
  if(!name || !email) {
    throw new CustomError.BadRequestError('Add meg az email címed és a neved.')
  }
  
  const foundUser = await User.findById(req.params.id)

  if(!foundUser) {
    throw new CustomError.NotFoundError(`Nem található felhasználó ${req.params.id} azonosítóval.`)
  }

  if(foundUser.name === name && foundUser.email === email) {
      throw new CustomError.BadRequestError('Az adatok nem változtak.')
  }

  if(foundUser._id.toString() !== req.user.id) {
    throw new CustomError.UnauthenticatedError('Érvénytelen hitelesítés.')
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {new: true})
    res.status(StatusCodes.OK).json({
      id: updatedUser._id, 
      name: updatedUser.name, 
      email: updatedUser.email, 
      token: updatedUser.createJWT()
    })
}
      

const getUser = async(req, res) =>  {
  const user = await User.findById(req.params.id)
  if(!user) {
    throw new CustomError.NotFoundError(`Nem található felhasználó ${req.params.id} azonosítóval.`)
  }
  res.status(StatusCodes.OK).json(user)
}


module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUser
}


