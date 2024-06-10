const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Bitacora = new Schema({
    accion: {
        type: String
    },
    fecha: {
        type: String
    }, 
    usuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: 'El usuario es obligatorio'
    }
})

module.exports = mongoose.model('Bitacora', Bitacora)