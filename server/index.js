const express = require('express')
const app = express()
const PORT = 8000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')


mongoose.connect('mongodb://localhost:27017/book', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => console.error('db error:', error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static('uploads'));

const userRouter = require('./routes/user')
app.use('/user', userRouter)

const booksRouter = require('./routes/books')
app.use('/books', booksRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
