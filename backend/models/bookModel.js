const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: String, 
    filename: String
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
