const { io } = require('../app')
const RealTimeData = require('../models/RealTimeData')

const externalTemperatureWatcher = () => {
  RealTimeData.watch([
    {
      $match:
      {
        'updateDescription.updatedFields.externalTemperature':
          { $exists: true }
      }
    }])
    .on('change', (change) => {
      console.log(change.updateDescription.updatedFields.externalTemperature)
      io.emit('externalTemperature', change.updateDescription.updatedFields.externalTemperature)
    })
}

module.exports = externalTemperatureWatcher
