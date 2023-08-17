const mongoose = require('mongoose');
const getGeoLocation = require('../utils/geolocation')
const { deleteFilesFromGCS } = require('../middleware/upload')

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

const BookSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true, 
        ref: 'User'
    },
    title: {
        type: String, 
        required: [true, 'Kérlek, add meg a könyv címét.'],
        trim: true
    },
    author: {
        type: String, 
        required: [true, 'Kérlek, add meg a szerzőt.'], 
        trim: true
    },
    location: {
        type: String, 
        required: [true, 'Kérlek, add meg a címet'],
        trim: true 
    }, 
    lang: {
        type: String,
        default: 'magyar',
        trim: true
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

BookSchema.pre('save', async function () {
   this.geolocation = await getGeoLocation(this.location)
})


BookSchema.pre('remove', async function () {
    const filenames = []
    for(let image of this.images) {
        if(image.filename === 'default') return
        filenames.push(image.filename)
    }
    await deleteFilesFromGCS(filenames)
})

module.exports = mongoose.model('Book', BookSchema)
