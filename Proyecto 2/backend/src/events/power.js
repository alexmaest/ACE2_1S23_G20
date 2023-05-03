
const { io } = require('../app')
const Setting = require('../models/Setting')

const powerWatcher = () => {
  Setting.watch([
    {
      $match:
      {
        'updateDescription.updatedFields.power':
        { $exists: true }
      }
    }])
    .on('change', (change) => {
      console.log(`From watcher power ${change.updateDescription.updatedFields.power}`)
      io.emit('power', change.updateDescription.updatedFields.power)
    })
}

module.exports = powerWatcher
