const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const morgan = require('morgan')

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('./routes/settings'))

module.exports = app
