const multer = require('multer')
const fs = require('fs')
const zip = require('express-zip');

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

exports.subirImagenes = (req, res, next) => {
    if(!req.files){
        res.status(400).json({ mensaje:'Error de subida', ok: false })
        return
    }
    res.status(200).json({ mensaje: 'Imagenes subidas al servidor', ok: true })
}

exports.descargarImagenes = async (req, res, next) => {

    const { fecha } = req.params

    const directorio =  __dirname + `../../uploads/${fecha}`

    if(!fs.existsSync(directorio)) {
        res.status(404).json({ mensaje: 'Directorio inexsistente', ok: false})
        return
    }

   let imagenes = []
     
   const folder = fs.readdirSync(directorio, (err, files) => {
        if(err) {
            res.status(500).json({ mensaje: 'error desconocido', ok: false})
            return
        }
    })

    if(folder.length === 0) {
        res.status(404).json({ mensaje: 'Sin archivos para descargar', ok: false})
        return
    }

    folder.forEach(element => {
        imagenes.push({ path: directorio+ `/${element}`, name: element})
    })

    res.status(200).zip(imagenes, `${fecha}.rar`)
}