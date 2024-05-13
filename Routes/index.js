const express = require('express')
const router = express.Router()
const pronosticosController = require('../Controlles/pronosticosController')
const upload = require('../Middleware/multer')


module.exports = function() {

    router.get('/pronostico/', pronosticosController.obtenervariable)

    router.post('/pronostico', upload.array('imagen'), pronosticosController.subirpronostico)

    return router
}