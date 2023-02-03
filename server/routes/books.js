const express = require('express')
const router = express.Router()
const Users = require('../models/users')
const Books = require('../models/books')
const jwt = require('jsonwebtoken')
const { check } = require('express-validator');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware')
var multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage });

router.post(
    '/new',
    [
        check('title').escape().trim(),
        check('author').escape().trim(),
        check('description').escape().trim(),
    ],
    isAuth,
    isAdmin,
    upload.single('image'),
    async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await Users.findById(decoded.id)
            if (user.role.includes('admin') === false) {
                res.status(401).send({
                    message: 'Unauthorized'
                })
                return
            }

            const { title, author, description } = req.body
            const newBook = await Books.create({
                title,
                author,
                description,
                image: req.file.path
            })
            res.status(200).json(newBook)
            return
        }
        catch (err) {
            res.send(err)
        }
    },
)

router.get('/all', async (req, res) => {
    try {
        console.log(">>>>>>>>",res)
        const books = await Books.find({})
        res.status(200).json(books)
        return
    }
    catch (err) {
        res.status(500)
            .send({
                message: err.message || "Some error occurred while retrieving books."
            })
    }
})


router.get('/:id', async (req, res) => {
    try {
        const book = await Books.findById(req.params.id)
        res.status(200).json(book)
        return
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving books."
        })
    }
})


//edit book
router.put('/edit/:id', [
    check('title').escape().trim(),
    check('author').escape().trim(),
    check('description').escape().trim(),
], isAuth, isAdmin,
    upload.single('image')
    , async (req, res) => {
        try {

            if (req.file === undefined) {
                const { title, author, description } = req.body
                const book = await Books.findByIdAndUpdate(req.params.id, {
                    title: title,
                    author: author,
                    description: description,
                })
                res.status(200).json(book)
                return
            }


            const oldImage = await Books.findById(req.params.id)
            fs.unlink(oldImage.image, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            const { title, author, description } = req.body
            const book = await Books.findByIdAndUpdate(req.params.id, {
                title: title,
                author: author,
                description: description,
                image: req.file.path
            })


            res.status(200).json(book)
            return
        }
        catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving books."
            })
        }
    })


router.delete('/delete/:id', isAuth, isAdmin, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const book = await Books.findByIdAndDelete(req.params.id)
        res.status(200).json(book)
        return
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving books."
        })
    }
})

//search book
router.get('/search/:title', isAuth, async (req, res) => {
    try {
        if (req.params.title === '') {
            const books = await Books.find({})
            res.status(200).json(books)
            return
        }

        const books = await Books.find({ title: { $regex: req.params.title, $options: 'i' } })
        res.status(200).json(books)
        return
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving books."
        })
    }
})


module.exports = router
