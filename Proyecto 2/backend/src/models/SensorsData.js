const { Schema, model } = require('mongoose')

const sensorsDataSchema = new Schema({
  data: [{
    externalTemperature: { type: Number, default: 0 },
    internalTemperature: { type: Number, default: 0 },
    soilMoisture: { type: Number, default: 0 },
    waterLevel: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
  }]
})

module.exports = model('dashboard', sensorsDataSchema)
