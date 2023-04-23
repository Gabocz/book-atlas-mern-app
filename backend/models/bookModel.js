const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        default: 'https://storage.googleapis.com/simple-book-images/default.jpg'
    }, 
    filename: {
        type: String,
        default: 'default'
    }
})

const bookSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'User'
    },
    title: {
        type: String, 
        required: [true, 'Kérlek, add meg a könyv címét.'],
    },
    author: {
        type: String, 
        required: [true, 'Kérlek, add meg a szerzőt.'], 
    },
    location: {
        type: String, 
        required: [true, 'Kérlek, add meg a címet']
    }, 
    lang: {
        type: String,
        default: 'magyar'
    }, 
    images: [ImageSchema],
            
    geolocation: {
        lat: Number,
        lng: Number
    }
},
{
   timestamps: true,
})

module.exports = mongoose.model('Book', bookSchema)
