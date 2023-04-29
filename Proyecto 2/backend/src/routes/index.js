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
  // console.log(data);
  // obtener datos de cadena recibida------------------------------------------------
  // const regex = /h\$(\d+)\$\*\$p\$(\d+)\$\*\$ti\$([\d.]+)\$\*\$te\$([\d.]+)\$\*/
  // const nuevaCadena = data.replace(regex, '$1,$2,$3,$4')
  // console.log(nuevaCadena) // "52,28,23.00,24.10"
  // const valores = nuevaCadena.split(',')

  let splittedData = data.split('$')
  splittedData = splittedData.filter((item) => item !== '')
  splittedData = splittedData.filter((item, index) => index % 2 !== 0)
  const sensorsData = {
    externalTemperature: Number(splittedData[3]),
    internalTemperature: Number(splittedData[2]),
    soilMoisture: Number(splittedData[0]),
    waterLevel: Number(splittedData[1])
  }

  try {
    await SensorsData.findOneAndUpdate({}, { $push: { data: sensorsData } }, { upsert: true })
  } catch (error) {
    res.json({ message: 'Error saving data' })
  }

  res.json({ message: 'Data Saved!' })
})

router.get('/api/sensorsData', async (req, res) => {
  const sensorsData = await SensorsData.find()
  res.json({ sensorsData })
})

module.exports = router
