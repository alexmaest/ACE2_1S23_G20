const mongoose = require('mongoose')

const connect = async () => {
  await mongoose.connect('mongodb+srv://G20:dTUJF6qQJkAdlHnO@ace2.h9ozb8r.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true
    })
  console.log('>>> DB is connected')
}

module.exports = { connect }
