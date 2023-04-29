const { Router } = require('express')

const router = Router()
const Setting = require('../models/Setting')
const RealTimeData = require('../models/RealTimeData')

const Dashboard = require('../models/Dashboard')

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
  const realTimeData = await Dashboard.find()
  console.log(realTimeData)
  res.json({ realTimeData })
})

//javier-----------------
router.post('/api/setDashboard', async (req, res) => {
  const data = req.body;
  //console.log(data);

  //conectar con mongoDB y la coleccion dashboards------------------------------------
  let dashboard = await Dashboard.findOne();

  // Si no existe, creamos uno nuevo y si ya existe lo sobre-escribimos
  if (!dashboard) {
    dashboard = new Dashboard();
  }

  //obtener datos de cadena recibida------------------------------------------------
  const regex = /h\$(\d+)\$\*\$p\$(\d+)\$\*\$ti\$([\d.]+)\$\*\$te\$([\d.]+)\$\*/;
  const nuevaCadena = data.replace(regex, '$1,$2,$3,$4');
  console.log(nuevaCadena); // "52,28,23.00,24.10"

  const valores = nuevaCadena.split(",");
  console.log(valores); // ["52", "28", "23.00", "24.10"]


  // Actualizamos los valores---------------------------------------------------
  dashboard.Hume = parseFloat(valores[0])
  dashboard.PAgua = parseFloat(valores[1])
  dashboard.TempI = parseFloat(valores[2])
  dashboard.TempE = parseFloat(valores[3])

  /*
  dashboard.TempE = 55
  dashboard.TempI = 66;
  dashboard.Hume = 45;
  dashboard.PAgua = 69;
  */

  // Guardamos los cambios en la base de datos ---------------------------------------------------
  await dashboard.save();
  console.log('Dashboard actualizado:', dashboard);
  res.send('POST request received and processed!!!.');
})






module.exports = router
