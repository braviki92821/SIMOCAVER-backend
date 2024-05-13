const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pronosticosSchema = new Schema({
    variable: {
        type: String,
        trim: true
    },
    fecha: {
        type: String
    },
    hora: {
        type: String
    },
    archivo: {
        type: String
    }
})

module.exports = mongoose.model('Pronosticos', pronosticosSchema)