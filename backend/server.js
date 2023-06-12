const path = require("path");
const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const PORT = process.env.PORT || 8000
const { errorHandler } = require('./middleware/ErrorMiddleware')
const connectDB = require('./dbConfig')

connectDB()
const app = express()

app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.use('/users', require('./routes/userRoutes'))
app.use('/books', require('./routes/bookRoutes'))

// Serve Frontend
if(process.env.NODE_ENV === 'production') {
    // Set build folder as static
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    app.get('*', (req, res) => res.sendFile(__dirname, '../', 'frontend', 'build', 'index.html'))

} else {
    app.get('/', (req, res) => {
        res.status(200).json({ message: 'Welcome to QuantumBook!'})
    })
}

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
