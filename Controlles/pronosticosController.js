const Pronosticos = require('../Models/Pronosticos')

exports.obtenervariable = (req, res, next) => {
    const { variable } = req.params

    res.json({mensaje: 'Hola tu variable es:' + variable})
}