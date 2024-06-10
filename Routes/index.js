const express = require('express')
const router = express.Router()
const pronosticosController = require('../Controlles/pronosticosController')
const pronosticosTsController = require('../Controlles/pronosticosTsController')
const usuariosController = require('../Controlles/usuariosController')
const auth = require('../Middleware/auth')

module.exports = function() {

    // router.get('/pronostico', pronosticosController.obtenerpronosticos)

    // router.get('/pronostico/:fecha', pronosticosController.obtenerpronostico)

    // router.post('/pronostico', pronosticosController.subirImagen, pronosticosController.subirpronostico)

    router.get('/pronostico', pronosticosTsController.obtenerpronosticos)

    router.get('/pronostico/:fecha', pronosticosTsController.obtenerpronostico)

    router.post('/pronostico/:fecha', auth, pronosticosTsController.subirImagen, pronosticosTsController.subirpronostico)

    router.put('/pronostico/:fecha', auth, pronosticosTsController.subirImagen, pronosticosTsController.editarPronostico)

    router.delete('/pronostico/:fecha', auth)

    router.post('/auth/registrar', usuariosController.registrarUsuario)

    router.post('/auth/autenticar', usuariosController.autenticarUsuario)

    return router
}