const express = require('express')
const routes = require('./Routes')
const mongosee = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
require('dotenv').config({path: '.env'})
require('./Models/Pronosticos')
const host = '127.0.0.1'
const port = 3000 || process.env.PORT

mongosee.Promise = global.Promise
mongosee.connect(process.env.SERVERMONGODB, {
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

app.listen(port, host, () => {
  console.log('http://'+host+':'+port)
})