const { Router } = require('express')

const router = Router()
const Setting = require('../models/Setting')

router.get('/api/settings', async (req, res) => {
  const Settings = await Setting.find()
  res.json(Settings)
})

router.post('/api/settings/add', async (req, res) => {
  const { power, timeToWater } = req.body
  await Setting.create({ power, timeToWater })
  res.json('Setting added')
})

module.exports = router
