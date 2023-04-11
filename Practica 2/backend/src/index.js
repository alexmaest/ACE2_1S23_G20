const app = require('./app')
const { connect } = require('./database')

const PORT = process.env.PORT || 3001

const main = async () => {
  await connect()
  await app.listen(PORT)
  console.log(`Server on port ${PORT}`)
}

main()
