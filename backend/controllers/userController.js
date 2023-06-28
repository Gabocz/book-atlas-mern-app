const { StatusCodes } = require('http-status-codes')
const User = require('../models/userModel')
const BadRequestError = require('../../errors/bad-request')
const NotFoundError = require('../../errors/not-found')
const UnauthorizedError = require('../../errors/unauthorized')

const registerUser = async(req, res) => {
  const user = await User.create({ ...req.body })
  res.status(StatusCodes.CREATED).json({
      id: user._id, 
      name: user.name,
      token: user.createJWT()
  })
}

const loginUser = async(req, res) => {
  const { email, password }  = req.body
    
  if(!email|| !password) {
    throw new BadRequestError('Töltsd ki az összes kötelező mezőt.')
  }
  
  const user = await User.findOne({email})
  
  if(!user) {
    throw new UnauthorizedError('Hibás belépési adatok.')
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if(!isPasswordCorrect) {
    throw new UnauthorizedError('Hibás belépési adatok.')
  }
  res.status(StatusCodes.OK).json({
    id: user._id, 
    name: user.name,
    token: user.createJWT()
  })
} 


const updateUser = async(req, res) => {
  const { name, email }  = req.body
    
  if(!name || !email) {
    throw new BadRequestError('Hiányzó adatok.')
  }
  
  const user = await User.findById(req.user.id)

  if(!user) {
    throw new NotFoundError('Felhasználó nem található.')
  }

  if(user.name === name && user.email === email) {
      throw new BadRequestError('Az adatok nem változtak.')
  }

  if(user._id.toString() !== req.user.id) {
    throw new UnauthorizedError('Hiányzó jogosultság.')
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(StatusCodes.OK).json(updatedUser)
}
      

const getUser = async(req, res) =>  {
  const user = await User.findById(req.params.id)
  if(!user) {
    throw new NotFoundError('Felhasználó nem található.')
  }
  res.status(StatusCodes.OK).json(user)
}


module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUser
}


