const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const morgan = require('morgan')

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET']
  }
})

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('./routes'))


module.exports = { server, io }
