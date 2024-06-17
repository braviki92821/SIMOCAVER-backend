const Usuarios = require('../Models/Usuarios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: '../Controlles/.env' })

exports.registrarUsuario = async (req, res) => {
    const usuario = new Usuarios(req.body)
    usuario.password = req.body.password

    try {
        await usuario.save()
        res.json({ mensaje: 'Usuario Creado Correctamente' })
    } catch (error) {
        console.log(error)
        res.json({mensaje: 'Hubo un error'})
    }
}

exports.autenticarUsuario = async (req, res, next) => {
    const { email, password } = req.body
    const usuario = await Usuarios.findOne({ email })

    if(!usuario) {
        await res.status(401).json({ mensaje: 'Ese usuario no existe' })
        next()
    } else {
        if(!bcrypt.compareSync(password, usuario.password)) {
            await res.status(401).json({ mensaje: 'Password Incorrecto' })
            next()
        } else {
            const token = jwt.sign({
                email: usuario.email,
                tipo: usuario.tipoUsuario,
                id: usuario._id
            }, process.env.LLAVESECRETA,{
                expiresIn: '1h'
            })

            res.status(200).json({token})
        }
    }
}

exports.autenticado = (req, res) => {
    if(!req.usuarioId) {
       return res.status(200).json({ mensaje: 'token expirado o invalido', auth: false })
    }
    res.status(200).json({ auth: true })
}