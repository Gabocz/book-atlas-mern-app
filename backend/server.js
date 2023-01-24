const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 8000
const connectDB = require('./dbConfig')

const app = express()

connectDB()

app.get('/', (req, res) => {
    res.send( 'Welcome to SimpleBook :-)!')
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
