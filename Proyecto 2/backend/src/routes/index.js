const { Router } = require('express')

const router = Router()
const Setting = require('../models/Setting')
const RealTimeData = require('../models/RealTimeData')
const SensorsData = require('../models/SensorsData')

router.get('/api/settings', async (req, res) => {
  const settings = await Setting.find()
  res.json({ settings })
})

router.put('/api/settings/modifyPower', async (req, res) => {
  const { power } = req.body
  await Setting.findOneAndUpdate({}, { power })
  res.json({ message: 'Power updated' })
})

router.put('/api/settings/modifyTime', async (req, res) => {
  const { timeToWater } = req.body
  await Setting.findOneAndUpdate({}, { timeToWater })
  res.json({ message: 'Time updated' })
})

router.post('/api/realTimeData/update', async (req, res) => {
  const { externalTemperature, internalTemperature, soilMoisture, waterLevel } = req.body
  await RealTimeData.findOneAndUpdate({}, { externalTemperature, internalTemperature, soilMoisture, waterLevel }, { upsert: true })
  res.json({ message: 'Real time data updated' })
})

router.get('/api/realTimeData', async (req, res) => {
  const realTimeData = await RealTimeData.find()
  res.json({ realTimeData })
})

// javier-----------------
router.post('/api/setDashboard', async (req, res) => {
  const data = req.body
  const splittedData = data.split('$')
  const sensorsData = {
    externalTemperature: Number(splittedData[3]),
    internalTemperature: Number(splittedData[2]),
    soilMoisture: Number(splittedData[0]),
    waterLevel: Number(splittedData[1]),
    isPumpOn: Number(splittedData[4]) === 1
  }

  try {
    await SensorsData.findOneAndUpdate({}, { $push: { data: sensorsData } }, { upsert: true })
  } catch (error) {
    console.log(error)
    res.json({ message: 'Error saving data' })
    return
  }

  try {
    await RealTimeData.findOneAndUpdate({}, { externalTemperature: sensorsData.externalTemperature, internalTemperature: sensorsData.internalTemperature, soilMoisture: sensorsData.soilMoisture, waterLevel: sensorsData.waterLevel }, { upsert: true })
  } catch (error) {
    console.log(error)
    res.json({ message: 'Error saving data' })
  }
  res.json({ message: 'Data Saved!' })
})

router.get('/api/sensorsData', async (req, res) => {
  const sensorsData = await SensorsData.find()
  res.json({ sensorsData })
})

router.get('/api/filteredData/:startDate/:endDate', async (req, res) => {
  const { startDate, endDate } = req.params
  const sensorsData = await SensorsData.find()
  const filteredData = sensorsData[0].data.filter((data) => {
    const date = new Date(data.date)
    return date >= new Date(startDate) && date <= new Date(endDate)
  })
  res.json({ filteredData })
})

router.get('/api/settings/arduino', async (req, res) => {
  const settings = await Setting.find()

  const { power, timeToWater } = settings[0]
  let response
  if (power) {
    response = `E${timeToWater};`
  } else {
    response = 'A;'
  }
  res.status(200).send(response)
})

module.exports = router
