const Book = require('../models/bookModel')
const User = require('../models/userModel')
const { deleteFileFromGCS } = require('../middleware/upload')
const BadRequestError = require('../../errors/bad-request')
const NotFoundError = require('../../errors/not-found')
const UnauthorizedError = require('../../errors/unauthorized')
const mongoose = require('mongoose')

 
const registerBook = async (req, res) => {
  const { title, author, location, lang, coords } = req.body

  if(!title || !author|| !location) {
      throw new BadRequestError('Töltsd ki az összes kötelező mezőt.')
    }

    const user = await User.findById(req.user.id)
    
    if(!user) {
        throw new NotFoundError('Felhasználó nem található.')
    }

    const book = await Book.create({
        title, 
        author, 
        location, 
        lang, 
        images: req.files.length ? req.files.map(f => ({ url: f.cloudStoragePublicUrl, filename: f.cloudStorageObject }))
        : {url: undefined, filename: undefined},
        geolocation: JSON.parse(coords), 
        user: req.user.id
        
    })
    res.status(201).json(book)
}


const updateBook = async (req, res) => {
    const { title, author, location, lang, coords, images } = req.body
    const imagesObj = req.files.length ? req.files.map(f => ({ url: f.cloudStoragePublicUrl, filename: f.cloudStorageObject }))
    : {url: undefined, filename: undefined}
    const user = await User.findById(req.user.id)
 
    if(!user) {
       throw new NotFoundError('Felhasználó nem található.')
    }
    const book = await Book.findById(req.params.id)
    if(!book) {
       throw new NotFoundError('Nem találtam a könyvet.')
    }
 
    if(book.user.toString() !== req.user.id) {
       throw new UnauthorizedError('Hiányzó jogosultság.')
    }
 
    const updatedBook = await Book.findByIdAndUpdate(req.params.id,  {title, author, location, lang, geolocation: JSON.parse(coords), images: req.files.length ? imagesObj : images }, {new: true})
 
    res.status(200).json(updatedBook)
 }


 const deleteBook = async (req, res) => {
    // Get user using the id in the JWT
    const user = await User.findById(req.user.id)
 
    if(!user) {
       throw new NotFoundError('Felhasználó nem található.')
    }
    const book = await Book.findById(req.params.id)
    let fileNames = []
    book.images.forEach(img => img.filename !== 'default' ? fileNames.push(img.filename) : fileNames = null)
 
    if(!book) {
       throw new NotFoundError('Nem találtam a könyvet.')
    }
 
    if(book.user.toString() !== req.user.id) {
       throw new UnauthorizedError('Hiányzó jogosultság.')
    }

    if(fileNames) {
        await deleteFileFromGCS(fileNames)
    }
 
    await book.remove()
 
    res.status(200).json({success: true})
 }
 

const getBooks = async (req, res) => {
    const { page = 1, limit = 8 } = req.query
    const books = await Book.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1})
        .exec()
            
        if(!books) {
            throw new NotFoundError('Nem találtunk könyveket.')
        } else {
        const count = await Book.countDocuments()
            res.status(200).json({
                books,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            })
    }
}


const getBook = async(req, res) => {
    const book = await Book.findById(req.params.id)
    if(!book) {
        throw new NotFoundError('Nem találtam ilyen könyvet.')
        } else {
        res.status(200).json(book)
    }
}



const getAllBooksByLoggedInUser = async(req, res) => {
    const user = await User.findById(req.user._id)

    if(!user) {
        throw new NotFoundError('Felhasználó nem található')
    }
    const books = await Book.find({user: req.user._id})

    res.status(200).json(books)
}

const getAllBooksByUser = async(req, res) => {
    const user = await User.findById(req.params.id)

    if(!user) {
        throw new NotFoundError('Felhasználó nem található')
    }
    const books = await Book.find({user: req.params.id})

    res.status(200).json(books)
}



const searchBooks = async(req, res) => {
    const searchTerm = req.query.query
    const newReg = new RegExp(searchTerm, 'i')
    if(!searchTerm) {
        throw new BadRequestError('A kereséshez írj valamit a keresőmezőbe!')
    }
    const books = await Book.find({ $or: [{ author: { '$regex': newReg } }, { title: { '$regex': newReg } }] })
    if(books.length === 0) {
        throw new NotFoundError('A keresés nem hozott eredményt.')
    }
    res.status(200).json(books)
}



module.exports = {
    registerBook,
    getBooks,
    getBook,
    getAllBooksByLoggedInUser,
    getAllBooksByUser,
    searchBooks,
    updateBook, 
    deleteBook,
}
