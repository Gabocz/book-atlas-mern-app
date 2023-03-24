const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const registerUser = asyncHandler(async(req, res) => {
  const { name, email, password }  = req.body
  
  if(!name || !email|| !password) {
      res.status(400)
      throw new Error('Töltsd ki az összes kötelező mezőt.')
    }

    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error ('Ez a felhasználó már létezik.')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name, 
        email, 
        password: hashedPassword 
    })

    if(user) {
        res.status(201).json({
            _id: user._id, 
            name: user.name,
            email: user.email, 
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Érvénytelen felhasználói adatok.')
    }
})

const loginUser = asyncHandler(async(req, res) => {
    const { email, password }  = req.body
    
    if(!email|| !password) {
        res.status(400)
        throw new Error('Töltsd ki az összes kötelező mezőt.')
      }
  
      const user = await User.findOne({email})
  
      if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id, 
            name: user.name,
            email: user.email, 
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Hibás belépési adatok.')
    }
  })

  const updateUser = asyncHandler(async(req, res) => {
    const { name, email }  = req.body
    
    if(!name || !email) {
        res.status(400)
        throw new Error('Töltsd ki az összes kötelező mezőt.')
      }
  
    const user = await User.findById(req.user.id)

    if(!user) {
        res.status(401)
        throw new Error('Felhasználó nem található.')
      }

      if(user._id.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Hiányzó jogosultság.')
     }

       const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
       res.status(200).json(updatedUser)

    })
      

  // const getCurrentUser = asyncHandler((req, res) => {
  //     const user = {
  //       id: req.user._id, 
  //       email: req.user.email,
  //       name: req.user.name
  //     }
  //     res.status(200).json(user)
  // })

  const getUser = asyncHandler(async(req, res) =>  {
    const  { id } = req.params
    const user = await User.findById(id)
    if(!user) {
      res.status(401)
      throw new Error('Felhasználó nem található.')
    }
    res.status(200).json(user)
  })

  // generate token
  const generateToken = (id) => {
       return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '14d'
       })
  }

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    // getCurrentUser,
    getUser
}


