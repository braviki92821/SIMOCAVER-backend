const express = require('express')
const router = express.Router()
const pronosticosController = require('../Controlles/pronosticosController')
const usuariosController = require('../Controlles/usuariosController')
const respaldoController = require('../Controlles/respaldoController')
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

    router.post('/auth/formReset', usuariosController.olvideContraseña)

    router.post('/auth/reset/:token', usuariosController.resetPassword)

    router.get('/auth/usuarios', auth, usuariosController.obtenerUsuarios)

    router.get('/auth/validarSesion', auth, usuariosController.autenticado)

    router.put('/auth/eliminar', auth, usuariosController.eliminarUsuario)

    router.post('/imagenes/:fecha', auth, respaldoController.subirImagen, respaldoController.subirImagenes)

    router.get('/bitacora', auth, pronosticosController.obtenerBitacora)

    router.get('/download/:fecha', respaldoController.descargarImagenes)

    return router
}