const { Schema, model } = require('mongoose')


const dashboardSchema = new Schema({
  TempE: Number,
  TempI: Number,
  Hume: Number,
  PAgua: Number
});

module.exports = model('dashboard', dashboardSchema)
