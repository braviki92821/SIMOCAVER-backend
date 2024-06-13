const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pronosticosTsSchema = new Schema({
    fecha: {
        type: String,
        unique: true
    },
    propiedades: [{
        variable: String,
        hora: Number,
        archivo: String
    }],
    graficas: [{
        variable: String,
        archivo: String
    }]
})

module.exports = mongoose.model('PronosticosTest', pronosticosTsSchema)