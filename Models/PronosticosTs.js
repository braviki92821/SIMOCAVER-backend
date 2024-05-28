const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pronosticosTsSchema = new Schema({
    fecha: {
        type: String
    },
    propiedades: [{
        variable: String,
        hora: Number,
        archivo: String
    }]
})

module.exports = mongoose.model('PronosticosTest', pronosticosTsSchema)