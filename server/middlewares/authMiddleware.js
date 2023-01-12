const Users = require("../models/users")
const jwt = require('jsonwebtoken')

function isAuth(req, res, next) {
    if (!req.headers.authorization) {
        res.status(401).send({
            message: 'Unauthorized'
        })
        return
    }

    //token expired
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.exp < Date.now() / 1000) {
        res.status(401).send({
            message: 'Unauthorized'
        })
        return
    }

    next()
}

async function isAdmin(req, res, next) {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.exp < Date.now() / 1000) {
        res.status(401).send({
            message: 'Unauthorized'
        })
        return
    }
    const user = await Users.findById(decoded.id)
    if (user.role.includes('admin') === false) {
        res.status(401).send({
            message: 'Unauthorized'
        })
        return
    }
    next()
}
module.exports = {
    isAuth,
    isAdmin
}