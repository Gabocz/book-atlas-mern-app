const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Kérlek, add meg a neved.'],
    },
    email: {
        type: String, 
        required: [true, 'Kérlek, add meg az email címed.'],
        unique: true 
    },
    password: {
        type: String, 
        required: [true, 'Kérlek, add meg a jelszavad']
    }, 
    isAdmin: {
        type: Boolean,
        required: true, 
        default: false
    }
},
{
   timestamps: true,
})

module.exports = mongoose.model('User', userSchema)
