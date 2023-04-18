const { Router } = require('express')

const router = Router()
const Setting = require('../models/Setting')
const RealTimeData = require('../models/RealTimeData')

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

module.exports = router
