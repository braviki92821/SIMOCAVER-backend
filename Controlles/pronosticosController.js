const Pronosticos = require('../Models/Pronosticos')
const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const Usuarios = require('../Models/Usuarios')
const Bitacora = require('../Models/Bitacora')

const configuracionMulter = {
    limits: { fileSize: 500000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            const destino = __dirname + `../../uploads/${req.params.fecha}/`
            if(!fs.existsSync(destino)) {
                fs.mkdirSync(destino, { recursive: true } )
            }
            cb(null, destino);
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1]
            cb(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, cb) {
        if ( file.mimetype === 'image/jpeg' ||  file.mimetype ==='image/png' ) {
            cb(null, true);
        } else {
            cb(new Error('Formato No válido'))
        }
    },
}

const upload = multer(configuracionMulter).single('archivo');

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(!req.file) {
            res.status(400).json({ mensaje: 'No se ha enviado un archivo a subir', ok: false })
            return
        }
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    res.status(400).json({ mensaje: 'El archivo es muy grande', ok: false })
                    return
                } else {
                    res.status(400).json({ mensaje: error.message, ok: false })
                    return
                }
            } else if(error.hasOwnProperty('message')) {
                res.status(400).json({ mensaje: error.message, ok: false })
                return
            }
        } else {
            next()
        }
    })
}

exports.obtenerpronosticos = async (req, res, next) => {
    try{
        const pronosticos = await Pronosticos.find({})
        res.json(pronosticos)
    } catch(error) {
        next()
    }
}

exports.obtenerpronostico = async (req, res, next) => {

    try {
        const { fecha } = req.params
        const regex = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/
        
        if(!regex.test(fecha)) {
            res.status(400).json({ mensaje: 'formato de fecha invalido' })
            return
        }

        const pronostico = await Pronosticos.findOne({ fecha })

        res.status(200).json(pronostico)
    } catch (error) {
        next()
    }
}

exports.subirpronostico = async (req, res, next) => {
    
    try{
        const { fecha } = req.params
        const { variable, hora } = req.body

        const regex = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/
        const regexRange = /^(0?[0-9]|1[0-9]|2[0-4])$/

        if(!regex.test(fecha)) {
            res.status(400).json({ mensaje: 'formato de fecha invalido', ok: false })
            return
        }

        if(!variable || !hora) {
            res.status(400).json({ mensaje: 'Cuerpo de la solicitud no valido', ok: false })
            return
        }

        if(!regexRange.test(hora)) {
            res.status(200).json({ mensaje: 'Fuera de rango de horas', ok: false })
            return
        }

        const pronostico =  await Pronosticos.findOne({ fecha: fecha })

        const newPronostico = {
            variable: req.body.variable,
            hora: req.body.hora,
            archivo: req.file.filename
        }

        const bitacora = new Bitacora({
            accion: 'Guardar pronostico',
            fecha:  new Date().toISOString().split('T')[0],
            usuario: req.usuarioId
        })

        if(!pronostico) {
            const testData = new Pronosticos({
                fecha,
                propiedades: newPronostico,
                graficas: []
            })
            await testData.save()
            await bitacora.save()
            res.status(200).json({ mensaje: "Pronostico agregado", ok: true })
            return
        }

        pronostico.propiedades.push(newPronostico)
        
        await pronostico.save()
        res.status(200).json({ mensaje: "Pronostico agregado", ok: true })
    } catch(error) {
        console.log(error)
        next()
    }
}

exports.editarPronostico = async (req, res, next) => {
    try {
        const { fecha } = req.params
        const { variable, hora } = req.body
        const regex = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/
        const regexRange = /^(0?[0-9]|1[0-9]|2[0-4])$/

        if(!regex.test(fecha)) {
            res.status(400).json({ mensaje: 'formato de fecha invalido', ok: false })
            return
        }

        if(!variable || !hora) {
            res.status(400).json({ mensaje: 'Cuerpo de la solicitud no valido', ok: false })
            return
        }

        if(!regexRange.test(hora)) {
            res.status(200).json({ mensaje: 'Fuera de rango de horas', ok: false })
            return
        }

        const pronostico =  await Pronosticos.findOne({ fecha: fecha })

        if(!pronostico) {
            res.status(404).json({ mensaje: 'No existen pronosticos para esta fecha', ok: false })
            return
        }

        const newPronostico = {
            variable: String(variable),
            hora: Number(hora),
            archivo: req.file.filename
        }

        const bitacora = new Bitacora({
            accion: 'Guardar pronostico',
            fecha:  new Date().toISOString().split('T')[0],
            usuario: req.usuarioId
        })

        let index = pronostico.propiedades.findIndex(x => x.variable === newPronostico.variable &&  x.hora === newPronostico.hora)

        if(index == -1) {
            res.status(404).json({ mensaje: 'Pronostico de variable inexistente', ok: false })
            return
        }

        if(req.file && pronostico.propiedades[index].archivo) {
            const imagenAnteriorPath =  __dirname + `../../uploads/${fecha}/${pronostico.propiedades[index].archivo}`
               fs.unlink(imagenAnteriorPath, (error) => {
                   if(error) {
                        res.status(500).json({ mensaje: error, ok: false })
                   }
                   return
               })
        }
        
        pronostico.propiedades[index] = newPronostico
    
        await bitacora.save()
        await pronostico.save()

        res.status(200).json({ mensaje: "Pronostico Modificado", ok: true })
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.eliminarPronostico = async (req, res, next) => {
    try {
        const { fecha } = req.params
        const regex = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/
        
        if(!regex.test(fecha)) {
            res.status(400).json({ mensaje: 'formato de fecha invalido', ok: false })
            return
        }

        const pronostico =  await Pronosticos.findOne({ fecha: fecha })

        const usuario = await Usuarios.findOne({ _id: req.usuarioId})

        if(!usuario) {
            res.status(404).json({ mensaje: 'No existe este usuario', ok: false })
            return
        }

        const autorizacion = usuario.compararPassword(req.body.password)

        if(!pronostico) {
            res.status(404).json({ mensaje: 'No hay pronostico para eliminar', ok: false  })
            return
        }

        if(!autorizacion){
            res.status(401).json({ mensaje: 'Contraseña incorrecta', ok: false })
            return
        }

        const bitacora = new Bitacora({
            accion: 'Eliminar pronostico',
            fecha:  new Date().toISOString().split('T')[0],
            usuario: req.usuarioId
        })

        const directorio = __dirname + `../../uploads/${fecha}`

        fs.rmdir(directorio, { recursive: true}, (error) => {
            console.log(error)
            if(error) {
             res.status(404).json({ mensaje: error, ok: false })
             return
            }        
        })
        
        await bitacora.save()
        await pronostico.deleteOne()
        
        res.status(200).json({ mensaje: `Pronostico con fecha: ${fecha} eliminado correctamente`, ok: true })
    } catch (error) {
        next()
    }
}

exports.subirgrafica = async (req, res, next) => {
    try {
        const { fecha } = req.params
        const { variable } = req.body

        const regex = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/

        if(!regex.test(fecha)) {
            res.status(400).json({ mensaje: 'formato de fecha invalido', ok: false })
            return
        }

        if(!variable) {
            res.status(400).json({ mensaje: 'Cuerpo de la solicitud no valido', ok: false })
            return
        }

        const pronostico =  await Pronosticos.findOne({ fecha: fecha })

        const grafica = {
            variable: req.body.variable,
            archivo: req.file.filename
        }

        if(!pronostico) {
            const testData = new Pronosticos({
                fecha,
                propiedades: [],
                graficas: grafica
            })
            await testData.save()
            res.status(200).json({ mensaje: "Grafica de pronostico agregado", ok: true })
            return
        }

        pronostico.graficas.push(grafica)
        await pronostico.save()
        res.status(200).json({ mensaje: "Grafica de pronostico agregado", ok: true })

    } catch (error) {
        console.log(error)
        next()
    }
}

exports.editarGrafica = async (req, res, next) => {
    try {
        const { fecha } = req.params
        const { variable } = req.body

        if(!regex.test(fecha)) {
            res.status(400).json({ mensaje: 'formato de fecha invalido', ok: false })
            return
        }

        if(!variable) {
            res.status(400).json({ mensaje: 'Cuerpo de la solicitud no valido', ok: false })
            return
        }

        const pronostico =  await Pronosticos.findOne({ fecha: fecha })

        if(!pronostico) {
            res.status(404).json({ mensaje: 'No existen pronosticos para esta fecha', ok: false })
            return
        }

        const newGrafica = {
            variable: String(variable),
            archivo: req.file.filename
        }

        let index = pronostico.graficas.findIndex(x => x.variable === newGrafica.variable)

        if(index == -1) {
            res.status(404).json({ mensaje: 'Grafica de pronostico no existente', ok: false })
            return
        }

        if(req.file && pronostico.graficas[index].archivo) {
            const imagenAnteriorPath =  __dirname + `../../uploads/${fecha}/${pronostico.graficas[index].archivo}`
               fs.unlink(imagenAnteriorPath, (error) => {
                   if(error) {
                        res.status(500).json({ mensaje: error, ok: false })
                   }
                   return
               })
        }

        pronostico.graficas[index] = newGrafica
    
        await pronostico.save()

        res.status(200).json({ mensaje: "Grafica de Pronostico Modificado", ok: true })

    } catch (error) {
        next()
    }
}

exports.obtenerBitacora = async (req, res, next) => {
    try {
        const bitacora = await Bitacora.find({}).populate('usuario')
        res.status(200).json(bitacora)
    } catch (error) {
        next()
    }
}