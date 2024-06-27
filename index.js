const express = require('express')
const routes = require('./Routes')
const mongosee = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
require('dotenv').config({path: '.env'})
require('./Models/Pronosticos')
require('./Models/Usuarios')
require('./Models/Bitacora')
const port = 3000 || process.env.PORT

mongosee.Promise = global.Promise
mongosee.connect('mongodb://'+process.env.USERMONGO+':'+process.env.PASSWORDMONGO+'@'+process.env.SERVERMONGODB+'/'+process.env.DATABASE+'?authSource=admin', {
  useNewUrlParser: true
})
//mongodb://root:password@172.16.17.2:27017/ 
//mongodb://simocaver:password@192.168.1.45:27017/
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
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));


app.listen(port, () => {
  console.log('http://:'+port)
})