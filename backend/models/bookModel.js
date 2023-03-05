const mongoose = require('mongoose');

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
    imgs: {
        type: Array, 
        default: ['https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80']
    }, 
    geolocation: {
        lat: Number,
        lng: Number
    }
},
{
   timestamps: true,
})

module.exports = mongoose.model('Book', bookSchema)
