const { server, io } = require('./app')
const { connect } = require('./database')
const soilMoistureWatcher = require('./events/soilMoisture')

const PORT = process.env.PORT || 3001

const main = async () => {
  await connect()
  await server.listen(PORT)
  soilMoistureWatcher()
  io.on('connection', (socket) => {
    console.log('New client connected')
    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
  console.log(`Server on port ${PORT}`)
}

main()
