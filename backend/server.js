require('express-async-errors')
const path = require("path");
const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const PORT = process.env.PORT || 8000
const errorHandlerMiddleware = require('./middleware/ErrorMiddleware')
const notFoundMiddleware = require("./middleware/NotFound");

const connectDB = require('./dbConfig');

connectDB()
const app = express()

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(xss())

// routes
app.use('/users', require('./routes/userRoutes'))
app.use('/books', require('./routes/bookRoutes'))

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// Serve Frontend
if(process.env.NODE_ENV === 'production') {
    // Set build folder as static
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    app.get('*', (req, res) => res.sendFile(__dirname, '../frontend/build', 'index.html'))
    
} else {
    app.get('/', (req, res) => {
        res.status(200).json({ message: 'Welcome to QuantumBook!'})
    })
}


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
