const Usuarios = require('../Models/Usuarios')
const jwt = require('jsonwebtoken')
const email = require('../Helpers/email')
const crypto = require('crypto')

exports.registrarUsuario = async (req, res) => {
    try {
        const usuario = new Usuarios(req.body)
        const generarPassword = Math.random().toString(36).substring(2)
        usuario.password = generarPassword
        usuario.estado = 'activo'

        await email.enviarEmail({
            email: req.body.email,
            nombre: req.body.nombre,
            password: usuario.password
        })

        await usuario.save()
        res.json({ mensaje: 'Usuario Creado Correctamente', ok: true })
    } catch (error) {
        res.json({ mensaje: 'Hubo un error', ok: false })
    }
}

exports.autenticarUsuario = async (req, res, next) => {
    const { email, password } = req.body
    const usuario = await Usuarios.findOne({ email })

    if(!usuario) {
        res.status(404).json({ mensaje: 'Ese usuario no existe', ok: false })
        next()
    } else {
        if(usuario.estado != 'activo'){
            res.status(401).json({ mensaje: 'Usuario Invalido', ok: false })
            return
        }
        if(!usuario.compararPassword(password)) {
            await res.status(401).json({ mensaje: 'Password Incorrecto', ok: false })
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
        const usuarios = await Usuarios.find({ _id: { $ne: req.usuarioId } }).select("-password")
        if(!usuarios) {
            res.status(404).json({mensaje: 'No hay usuarios', ok: false })
            return
        }

        res.status(200).json(usuarios)
    } catch (error) {
        next()
    }
} 

exports.olvideContraseña = async (req, res, next) => {
    try {       
        const { correo } = req.body
        const usuario = await Usuarios.findOne({ email: correo })

        if(!usuario) {
            res.status(404).json({ mensaje: 'Correo no registrado', ok: false })
            return
        }
    
        usuario.token = crypto.randomBytes(20).toString('hex')
        usuario.expire = Date.now() + 3600000
    
        await email.resetPasswordEmail({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        await usuario.save()
        res.status(200).json({ mensaje: 'Revisa tu correo para las instrucciones', ok: true })
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params
        const { password, confirmar } = req.body
        const usuario = await Usuarios.findOne({
            token: token,
            expire: {
                $gt: Date.now()
            }
        })

        if(!usuario) {
            res.status(404).json({ mensaje: 'Token expirado o no valido', ok: false })
            return
        }

        if(password != confirmar){
            res.status(400).json({ mensaje: 'Contraseñas no son iguales', ok: false })
            return
        }

        usuario.password = password
        usuario.token = undefined
        usuario.expire = undefined

        await usuario.save()
        res.status(200).json({ mensaje: 'tu contraseña ha sido reestablecida vuelva a iniciar sesion', ok: true})
    } catch (error) {
        next()
    }
}

exports.eliminarUsuario = async (req, res, next) => {
    try {
        const { id, estado } = req.body

        const usuario = await Usuarios.findById(id)

        if(!usuario) {
            res.status(404).json({ mensaje: 'Este usuario no existe', ok: false })
            return
        }

        if(usuario.estado != estado) {
            res.status(400).json({ mensaje: 'Estado no coincidente', ok: false })
            return
        }

        if(usuario.estado === 'activo'){
            usuario.estado = 'inactivo'
            await usuario.save()
            res.status(200).json({ mensaje:'Este usuario ha sido inhabilitado', ok: true})
            return
        }

        usuario.estado = 'activo'
        await usuario.save()
        res.status(200).json({ mensaje:'Este usuario ha sido activado', ok: true })
    } catch (error) {
        next()
    }
}