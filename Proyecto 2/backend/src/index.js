const { server, io } = require('./app')
const { connect } = require('./database')
const soilMoistureWatcher = require('./events/soilMoisture')
const waterLevelWatcher = require('./events/waterLevel')
const internalTemperatureWatcher = require('./events/internalTemperature')
const externalTemperatureWatcher = require('./events/externalTemperature')
const powerWatcher = require('./events/power')

const PORT = process.env.PORT || 3001

const main = async () => {
  await connect()
  await server.listen(PORT)
  powerWatcher()
  soilMoistureWatcher()
  waterLevelWatcher()
  internalTemperatureWatcher()
  externalTemperatureWatcher()
  io.on('connection', (socket) => {
    console.log('New client connected')
    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
  console.log(`Server on port ${PORT}`)
}

main()
