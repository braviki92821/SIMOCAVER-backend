const Pronosticos = require('../Models/PronosticosTs')
const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../uploads/test/');
        },
        filename: (req, file, cb) => {
            //const extension = file.mimetype.split('/')[1];
            cb(null, `${file.originalname}`);
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

// pasar la configuración y el campo
const upload = multer(configuracionMulter).single('archivo');

exports.obtenerpronostico = async (req, res, next) => {

    try {
        const { fecha } = req.params
        const pronostico = await Pronosticos.findOne({ fecha })
        res.json(pronostico)
    } catch (error) {
        next()
    }
}

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    res.json({ mensaje: 'El archivo es muy grande' })
                } else {
                    res.json({ mensaje: error.message })
                }
            } else if(error.hasOwnProperty('message')) {
                res.json({ mensaje: error.message })
            }
            return next()
        } else {
            next()
        }
    })
}

exports.subirpronostico = async (req, res, next) => {
    const { fecha } = req.params
    try{
        const pronostico =  await Pronosticos.findOne({ fecha: fecha })

        const newPronostico = {
            variable: req.body.variable,
            hora: req.body.hora,
            archivo: req.file.filename
        }

        if(!pronostico) {
            const testData = new Pronosticos({
                fecha,
                propiedades: newPronostico
            })
            await testData.save()
            res.status(200).json({ mensaje: "Pronostico agregado" })
            return
        }

        pronostico.propiedades.push(newPronostico)
        await pronostico.save()
        res.status(200).json({ mensaje: "Pronostico agregado" })
    } catch(error) {
        console.log(error)
        next()
    }
}

exports.obtenerpronosticos = async (req, res, next) => {
    try{
        const pronosticos = await Pronosticos.find({})
        res.json(pronosticos)
    } catch(error) {
        next()
    }
}