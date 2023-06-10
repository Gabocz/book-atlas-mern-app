const asyncHandler = require('express-async-handler')
const Book = require('../models/bookModel')
const User = require('../models/userModel')
const { deleteFileFromGCS } = require('../middleware/upload')

 
const registerBook = asyncHandler(async (req, res) => {
  const { title, author, location, lang, coords } = req.body

  
  if(!title || !author|| !location) {
      res.status(400)
      throw new Error('Töltsd ki az összes kötelező mezőt.')
    }

    const user = await User.findById(req.user.id)
    
    if(!user) {
        res.status(404)
        throw new Error('Felhasználó nem található.')
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
})


const updateBook = asyncHandler(async (req, res) => {
    const { title, author, location, lang, coords, images } = req.body
    const imagesObj = req.files.length ? req.files.map(f => ({ url: f.cloudStoragePublicUrl, filename: f.cloudStorageObject }))
    : {url: undefined, filename: undefined}
    const user = await User.findById(req.user.id)
 
    if(!user) {
       res.status(401)
       throw new Error('Felhasználó nem található.')
    }
    const book = await Book.findById(req.params.id)
    if(!book) {
       res.status(404)
       throw new Error('Nem találtam a könyvet.')
    }
 
    if(book.user.toString() !== req.user.id) {
       res.status(401)
       throw new Error('Hiányzó jogosultság.')
    }
 
    const updatedBook = await Book.findByIdAndUpdate(req.params.id,  {title, author, location, lang, geolocation: JSON.parse(coords), images: req.files.length ? imagesObj : images }, {new: true})
 
    res.status(200).json(updatedBook)
 })


 const deleteBook = asyncHandler(async (req, res) => {
    // Get user using the id in the JWT
    const user = await User.findById(req.user.id)
 
    if(!user) {
       res.status(401)
       throw new Error('Felhasználó nem található.')
    }
    const book = await Book.findById(req.params.id)
    const fileNames = []
    book.images.forEach(img => fileNames.push(img.filename))
 
    if(!book) {
       res.status(404)
       throw new Error('Nem találtam a könyvet.')
    }
 
    if(book.user.toString() !== req.user.id) {
       res.status(401)
       throw new Error('Hiányzó jogosultság.')
    }

    if(fileNames) {
        await deleteFileFromGCS(fileNames)
    }
 
    await book.remove()
 
    res.status(200).json({success: true})
 })
 

const getBooks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 8 } = req.query
    const books = await Book.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1})
        .exec()
            
        if(!books) {
            res.status(404)
            throw new Error('Nem találtunk könyveket.')
        } else {
        const count = await Book.countDocuments()
            res.status(200).json({
                books,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            })
    }
})


const getBook = asyncHandler(async(req, res) => {
        const book = await Book.findById(req.params.id)
        if(!book) {
            res.status(404)
            throw new Error('Nem találtam ilyen könyvet.')
        } else {
            res.status(200).json(book)
          }
})



const getAllBooksByUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id)

    if(!user) {
        res.status(404)
        throw new Error('Felhasználó nem található')
    }
    const books = await Book.find({user: req.user.id})

    res.status(200).json(books)
})


const searchBooks = asyncHandler(async(req, res) => {
    const searchTerm = req.query.query
    const newReg = new RegExp(searchTerm, 'i')
    if(!searchTerm) {
        res.status(400)
        throw new Error('A kereséshez írj valamit a keresőmezőbe!')
    }
    const books = await Book.find({ $or: [{ author: { '$regex': newReg } }, { title: { '$regex': newReg } }] })
    if(books.length === 0) {
        res.status(404)
        throw new Error('A keresés nem hozott eredményt.')
    }
    res.status(200).json(books)
})



module.exports = {
    registerBook,
    getBooks,
    getBook,
    getAllBooksByUser,
    searchBooks,
    updateBook, 
    deleteBook,
}
