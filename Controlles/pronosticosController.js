const Pronosticos = require('../Models/Pronosticos')
const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../uploads/');
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

exports.obtenervariable = (req, res, next) => {

    res.json({mensaje: 'Hola tu variable es:' + variable})
}

exports.obtenerpronostico = async (req, res, next) => {

    try {
        const { fecha } = req.params
        const pronostico = await Pronosticos.find({ fecha })
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
                    req.json({ mensaje: 'El archivo es muy grande' })
                } else {
                    req.json({ mensaje: error.message })
                }
            } else if(error.hasOwnProperty('message')) {
                req.json({ mensaje: error.message })
            }
            return next()
        } else {
            next()
        }
    })
}

exports.subirpronostico = async (req, res, next) => {
    const pronostico = new Pronosticos(req.body)

    try{
        if(req.file.filename) {
            pronostico.archivo = req.file.filename
        }
        await pronostico.save()
        res.status(200).json({ mensaje: "Pronostico agregado" })
    } catch(error) {
        console.log(error)
        next()
    }
}



