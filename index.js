const express = require('express')
const routes = require('./Routes')
const mongosee = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
require('dotenv').config({path: '.env'})
require('./Models/Pronosticos')

mongosee.Promise = global.Promise
mongosee.connect('mongodb://localhost/simocaver', {
  useNewUrlParser: true
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))
  
// const listaBlanca = ['http://localhost:4200']


// const corsOptions = {
//   origin: (origin, callback) => {
//       console.log(origin)
//       const existe = listaBlanca.some(domain => domain === origin)
//       if(existe) {
//           callback(null, true)
//       } else {
//           callback(new Error('No permitiro por CORS'))
//       }
//   }
// }

app.use(cors())

app.use('/', routes())
app.use("/uploads", express.static(path.resolve(__dirname, 'uploads')));

app.listen(3000)