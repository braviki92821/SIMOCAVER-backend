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
        req.usuarioId = id
    } catch (error) {
        error.statusCode = 401
        if(error.message === 'jwt expired') {
            return res.status(401).json( { mensaje: 'Token expirado vuelva a iniciar sesion'} )
        }

        if(error.message === 'invalid signature') {
            return res.status(401).json( { mensaje: 'Token alterado o invalido'} )
        }
        throw error
    }

    if(!revisarToken) {
        const error = new Error('No autenticado')
        error.statusCode = 401
        throw error
    }

    next()
}