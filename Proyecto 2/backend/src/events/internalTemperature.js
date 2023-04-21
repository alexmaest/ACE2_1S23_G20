const { io } = require('../app')
const RealTimeData = require('../models/RealTimeData')

const internalTemperatureWatcher = () => {
  RealTimeData.watch([
    {
      $match:
      {
        'updateDescription.updatedFields.internalTemperature':
          { $exists: true }
      }
    }])
    .on('change', (change) => {
      console.log(change.updateDescription.updatedFields.internalTemperature)
      io.emit('internalTemperature', change.updateDescription.updatedFields.internalTemperature)
    })
}

module.exports = internalTemperatureWatcher
