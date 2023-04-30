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
  const values = []
  splittedData = splittedData.filter((item) => item !== '')
  let indiceValue = 0
  for (let i = 0; i < splittedData.length; i++) {
    const element = splittedData[i]
    if (!isNaN(parseFloat(element))) {
      values[indiceValue] = parseFloat(element)
      indiceValue++
    }
  }
  const sensorsData = {
    externalTemperature: Number(values[3]),
    internalTemperature: Number(values[2]),
    soilMoisture: Number(values[0]),
    waterLevel: Number(values[1])
  }

  try {
    await SensorsData.findOneAndUpdate({}, { $push: { data: sensorsData } }, { upsert: true })
  } catch (error) {
    console.log(error)
    res.json({ message: 'Error saving data' })
    return
  }

  res.json({ message: 'Data Saved!' })
})

router.get('/api/sensorsData', async (req, res) => {
  const sensorsData = await SensorsData.find()
  res.json({ sensorsData })
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

/* //filtrado de fechas------------------------------------------------
router.post('/api/filteredData', async (req, res) => {

  try {

    console.log(req.body.data)
    const { startDate, endDate, startTime, endTime, name } = req.body.data;
    console.log("::::::::::::::::::::::")
    console.log(startDate + " " + endDate + " " + startTime + " " + endTime + " " + name)
    //----------------------------------

    // Verifica si se proporcionó fecha de inicio
    if (startDate !== "") {
      const partesFecha = startDate.split('-');
      fechaInicio = new Date(Date.UTC(partesFecha[0], partesFecha[1] - 1, partesFecha[2]));
      fechaInicio.setHours(0, 0, 0, 0);//ojo
      console.log(">>" + fechaInicio)
    } else {
      let info = await SensorsData.find({}, { _id: 0 }).limit(1);
      fechaInicio = new Date(Date.UTC(info[0].date));
      fechaInicio.setHours(0, 0, 0, 0);
      console.log(fechaInicio)
    }

    // Verifica si se proporcionó fecha de fin
    if (endDate !== "") {
      const partesFecha = endDate.split('-');
      fechaFin = new Date(Date.UTC(partesFecha[0], partesFecha[1] - 1, partesFecha[2]));
      fechaFin.setHours(17, 59, 59, 999);//ojo
      console.log(">>" + fechaFin)
    } else {
      fechaFin = new Date(Date.UTC());
      fechaFin.setHours(23, 59, 59, 999);
      console.log(fechaFin)
    }

    //------------------------------------------------------------------------

    const data = await SensorsData.find({
      "data.date": {
        $gte: fechaInicio,
        $lte: fechaFin
      }
    }, { _id: 0 });

    console.log("..................");
    console.log(data);
    //console.log(data[0].data);

    if (data.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron datos para las fechas especificadas."
      });
    }

    //res.json(data);
    res.json(data[0].data);

    //res.json({ message: 'filtrado ok' })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      externalTemperature: 0,
      internalTemperature: 0,
      soilMoisture: 0,
      waterLevel: 0,
      date: Date.now
    });
  }
}) */

module.exports = router
