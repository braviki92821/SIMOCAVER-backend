const express = require('express')
const router = express.Router()
const pronosticosController = require('../Controlles/pronosticosController')


module.exports = function() {

    router.get('/pronostico/:variable', pronosticosController.obtenervariable)

    return router
}