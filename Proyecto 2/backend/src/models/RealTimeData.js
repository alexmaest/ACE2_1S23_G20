const { Schema, model } = require('mongoose')

const RealTimeDataSchema = new Schema({
  externalTemperature: Number,
  internalTemperature: Number,
  soilMoisture: Number,
  waterLevel: Number
})

module.exports = model('RealTimeData', RealTimeDataSchema)
