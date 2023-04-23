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
// app.use('/uploads', express.static('uploads'))


app.get('/', (req, res) => {
    res.send( 'Welcome to SimpleBook :-)!')
})


// Routes
app.use('/users', require('./routes/userRoutes'))
app.use('/books', require('./routes/bookRoutes'))

app.use(errorHandler)





app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
