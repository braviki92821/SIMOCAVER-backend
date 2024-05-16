const express = require('express')
const routes = require('./Routes')
const mongosee = require('mongoose')
const bodyParser = require('body-parser')
//const cors = require('cors')
require('dotenv').config({path: '.env'})
require('./Models/Pronosticos')

mongosee.Promise = global.Promise
mongosee.connect('mongodb://localhost/simocaver', {
  useNewUrlParser: true
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

//app.use(cors())

app.use('/', routes())
app.use("/uploads", express.static(path.resolve(__dirname, 'uploads')));

app.listen(3000)