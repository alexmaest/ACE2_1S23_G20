const { io } = require('../app')
const RealTimeData = require('../models/RealTimeData')

const waterLevelWatcher = () => {
  RealTimeData.watch([
    {
      $match:
      {
        'updateDescription.updatedFields.waterLevel':
        { $exists: true }
      }
    }])
    .on('change', (change) => {
      console.log(change.updateDescription.updatedFields.waterLevel)
      io.emit('waterLevel', change.updateDescription.updatedFields.waterLevel)
    })
}

module.exports = waterLevelWatcher
