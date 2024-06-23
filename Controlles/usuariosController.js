const Usuarios = require('../Models/Usuarios')
const jwt = require('jsonwebtoken')
const email = require('../Helpers/email')
require('dotenv').config({ path: '../Controlles/.env' })

exports.registrarUsuario = async (req, res) => {
    const usuario = new Usuarios(req.body)

    const generarPassword = Math.random().toString(36).substring(2)
    usuario.password = generarPassword
    try {
        await email.enviarEmail({
            email: req.body.email,
            nombre: req.body.nombre,
            password: usuario.password
        })

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
        if(!usuario.compararPassword(password)) {
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

exports.obtenerUsuarios = async (req, res, next) => {

    try {
        const usuarios = await Usuarios.find({ _id: { $ne: req.usuarioId } })
        if(!usuarios) {
            res.status(404).json({mensaje: 'No hay usuarios' })
            return
        }

        res.status(200).json(usuarios)
    } catch (error) {
        next()
    }
}