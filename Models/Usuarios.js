const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const Usuarios = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tipoUsuario: {
        type: String, 
        required: true
    },
    token: String,
    expire: Date,
    estado: String
})

Usuarios.pre('save', async function(next){
    if(!this.isModified('password')) {
        return next()
    }

    const hash = await bcrypt.hash(this.password, 12)
    this.password = hash
    next()
})

Usuarios.post('save', function(error, doc, next){
    if(error.name === 'MongoServerError' && error.code === 11000){
        next('Este correo ya esta registrado')
    } else {
        next(error)
     }
})

Usuarios.methods = {
    compararPassword: function(password) {
        return bcrypt.compareSync(password, this.password)
    }
}

module.exports = mongoose.model('Usuarios', Usuarios)
