
const { io } = require('../app')
const RealTimeData = require('../models/RealTimeData')

const soilMoistureWatcher = () => {
  RealTimeData.watch([
    {
      $match:
      {
        'updateDescription.updatedFields.soilMoisture':
        { $exists: true }
      }
    }])
    .on('change', (change) => {
      console.log(change.updateDescription.updatedFields.soilMoisture)
      io.emit('soilMoisture', change.updateDescription.updatedFields.soilMoisture)
    })
}

module.exports = soilMoistureWatcher
