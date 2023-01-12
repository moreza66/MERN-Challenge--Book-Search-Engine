const { validationResult } = require("express-validator")

async function checkValidationResult(req, res, next) {
    return res.status(400).json({
        errors: errors.array(),
    })
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array()
        })
        return
    }
    next()
}
module.exports = checkValidationResult