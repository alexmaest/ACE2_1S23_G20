const { Schema, model } = require('mongoose')

const SettingSchema = new Schema({
  power: Boolean,
  timeToWater: Number

})

module.exports = model('Setting', SettingSchema)
