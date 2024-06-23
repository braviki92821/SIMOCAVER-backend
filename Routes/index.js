const express = require('express')
const router = express.Router()
const pronosticosController = require('../Controlles/pronosticosController')
const usuariosController = require('../Controlles/usuariosController')
const auth = require('../Middleware/auth')

module.exports = function() {

    router.get('/pronostico', pronosticosController.obtenerpronosticos)

    router.get('/pronostico/:fecha', pronosticosController.obtenerpronostico)

    router.post('/pronostico/:fecha', auth, pronosticosController.subirImagen, pronosticosController.subirpronostico)

    router.put('/pronostico/:fecha', auth, pronosticosController.subirImagen, pronosticosController.editarPronostico)

    router.delete('/pronostico/:fecha', auth, pronosticosController.eliminarPronostico)

    router.post('/pronostico/grafica/:fecha', auth, pronosticosController.subirImagen, pronosticosController.subirgrafica)

    router.put('/pronostico/grafica/:fecha', auth, pronosticosController.subirImagen, pronosticosController.editarGrafica)

    router.post('/auth/registrar', auth, usuariosController.registrarUsuario)

    router.post('/auth/autenticar', usuariosController.autenticarUsuario)

    router.get('/auth/usuarios', auth, usuariosController.obtenerUsuarios)

    router.get('/auth/validarSesion', auth, usuariosController.autenticado)

    return router
}