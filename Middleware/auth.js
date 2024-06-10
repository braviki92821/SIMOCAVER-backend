const jwt = require('jsonwebtoken')
require('dotenv').config({path: '../Middleware/.env'})

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')

    if(!authHeader) {
        const error = new Error('No autenticado, no hay jwt')
        error.statusCode = 401
        throw error
    }

    const token = authHeader.split(' ')[1]
    let revisarToken
    try {
        revisarToken = jwt.verify(token, process.env.LLAVESECRETA)
        const { id } = revisarToken
        req.id = id
    } catch (error) {
        console.log(error)
        error.statusCode = 401
        throw error
    }

    if(!revisarToken) {
        const error = new Error('No autenticado')
        error.statusCode = 401
        throw error
    }

    next()
}