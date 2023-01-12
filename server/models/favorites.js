const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    bookID: {
        type: String,
        required: true,
        unique: true,
    }
})

const Favorite = mongoose.model('Favorite', favoriteSchema)

module.exports = Favorite