const express = require('express')
const router = express.Router()
const Users = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const env = require('dotenv').config()
const { check, validationResult } = require('express-validator');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware')
const Favorites = require('../models/favorites')

//login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await Users.findOne({ email })
        if (!user) {
            res.status(400).json({ message: 'User not found' })
            return
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' })
            return
        }
        res.status(200).send({
            token: jwt.sign({
                id: user._id,
                role: user.role
            }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            })
        })
        return
    } catch (err) {
        res.json({
            message: err
        })
    }
})

//register
router.post('/register', [
    check('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
], async (req, res) => {
    const validationResults = validationResult(req)
    if (!validationResults.isEmpty()) {
        return res.status(400).json({
            message: validationResults.errors[0].msg
        })
    }
    try {
        const { email, password } = req.body
        const userExists = await Users.findOne({
            email
        })
        if (userExists) {
            res.status(400).send({
                message: 'User already exists'
            })
            return
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) throw err
                const newUser = await Users.create({
                    email,
                    password: hash,
                    role: ['user']
                })
                res.json({
                    token: jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
                        expiresIn: '30d'
                    })
                })
            })
        })

    } catch (err) {
        res.json({
            message: err
        })
    }
})

//add to favorites
router.post('/addFavorite/:id', [
    check('bookID').isMongoId(),
    check('userId').isMongoId()
], isAuth, async (req, res) => {

    try {
        const { id } = req.params

        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id

        //check if book is already in favorites
        const favorite = await Favorites.findOne({
            userID: userId,
            bookID: id
        })
        if (favorite) {
            res.status(400).json({
                message: 'Book already in favorites'
            })
            return
        }

        //inset to favorites
        await Favorites.create({
            userID: userId,
            bookID: id
        })

        res.status(200).json({
            message: 'Added to favorites'
        })
    } catch (err) {
        res.json({
            message: err.message
        })
        return
    }
})

//remove from favorites
router.post('/removeFavorite/:id', isAuth, async (req, res) => {
    try {
        const { id } = req.params

        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id

        //check if book is already in favorites
        const favorite = await Favorites.findOne({
            userId,
            bookID: id
        })
        if (!favorite) {
            res.status(400).json({
                message: 'Book not in favorites'
            })
            return
        }

        //remove from favorites
        await Favorites.deleteOne({
            userId,
            bookID: id
        })

        res.status(200).json({
            message: 'Removed from favorites'
        })
    } catch (err) {
        res.json({
            message: err.message
        })
        return
    }
})

router.get('/favorites', isAuth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id

        const favorites = await Favorites.find({
            userID: userId
        })

        res.status(200).json({
            favorites
        })
    } catch (err) {
        res.json({
            message: err.message
        })
        return
    }
})
module.exports = router

