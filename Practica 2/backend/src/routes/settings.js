const { Router } = require('express')

const router = Router()
const Setting = require('../models/Setting')

router.get('/api/settings', async (req, res) => {
  const settings = await Setting.find()
  res.json({ settings })
})

router.put('/api/settings/modify', async (req, res) => {
  const { power, timeToWater } = req.body
  await Setting.findOneAndUpdate({}, { power, timeToWater })
  res.json({ message: 'Settings updated' })
})

module.exports = router
