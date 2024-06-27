const multer = require('multer')
const fs = require('fs')

const configuracionMulter = {
    limits: { fileSize: 200000},
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
            cb(null, file.originalname)
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

const upload = multer(configuracionMulter).array('archivo')

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    res.status(200).json({ mensaje: 'El archivo es muy grande' })
                    return
                } else {
                    res.status(200).json({ mensaje: error.message })
                    return
                }
            } else if(error.hasOwnProperty('message')) {
                res.status(200).json({ mensaje: error.message })
                return
            }
        } else {
            next()
        }
    })
}

exports.subirImagenes = (req, res, next) => {
    if(!req.files){
        res.status(400).json({mensaje:'Error de subida'})
        return
    }
    res.status(200).json({mensaje: 'Imagenes subidas al servidor'})
}