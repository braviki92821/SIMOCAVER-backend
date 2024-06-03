const express = require('express')
const router = express.Router()
const pronosticosController = require('../Controlles/pronosticosController')
const pronosticosTsController = require('../Controlles/pronosticosTsController')


module.exports = function() {

    router.get('/pronostico', pronosticosController.obtenerpronosticos)

    router.get('/pronostico/:fecha', pronosticosController.obtenerpronostico)

    router.post('/pronostico', pronosticosController.subirImagen, pronosticosController.subirpronostico)

    router.get('/pronosticotest', pronosticosTsController.obtenerpronosticos)

    router.get('/pronosticotest/:fecha', pronosticosTsController.obtenerpronostico)

    router.post('/pronosticotest/:fecha', pronosticosTsController.subirImagen, pronosticosTsController.subirpronostico)

    router.put('/pronosticotest/:fecha', pronosticosTsController.subirImagen, pronosticosTsController.editarPronostico)

    return router
}