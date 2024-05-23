const express = require('express')
const router = express.Router()
const pronosticosController = require('../Controlles/pronosticosController')
const upload = require('../Middleware/multer')


module.exports = function() {

    router.get('/pronostico/:fecha', pronosticosController.obtenerpronostico)

    router.post('/pronostico', pronosticosController.subirImagen, pronosticosController.subirpronostico)

    return router
}