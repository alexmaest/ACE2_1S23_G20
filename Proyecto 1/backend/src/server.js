import express from 'express'
import cors from 'cors'
import body from 'body-parser'
import {
  registerUser,
  loginUser,
  updatePenalties,
  createPomodoro,
  createReport,
  getPomodoro,
  resetPenalties,
  getRealTimePenalties,
  queryReport1And2,
  queryReport3,
  queryReport4,
  queryReport5And6
} from './hooks/useQueries.js'

let _rest = ''
let _userId
let _pomodoroId

const app = express()

app.use(body.urlencoded({ extended: false }))
app.use(body.json())
const port = 3555

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/register', async (req, res) => {
  const { username, fullName, password } = req.body

  const _registerUser = await registerUser(username, fullName, password)

  if (_registerUser.length > 0) {
    return res.status(400).send({ message: 'User already exists' })
  }

  res.status(200).send({ message: 'User registered' })
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  console.log('Entro a login')

  const _loginUser = await loginUser(username, password)

  if (_loginUser.length > 0) {
    _userId = _loginUser[0].idUsuario
    return res.status(200).send({
      id: _loginUser[0].idUsuario,
      name: _loginUser[0].userName,
      fullName: _loginUser[0].fullName
    })
  }

  return res.status(400).send({ message: 'Invalid password or username' })
})

app.post('/api/sendRest', async (req, res) => {
  const { rest } = req.body
  console.log(_userId)
  _rest = `D${rest}`
  res.status(200).send({ message: 'Rest saved' })
})

app.get('/api/getRest', async (req, res) => {
  res.status(200).send({ rest: _rest })
})

app.get('/api/getPomoData', async (req, res) => {
  fetch('http://localhost:3556/api/pomoData', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      // _pomoData = data
      // res.status(200).send({ pomoData: _pomoData })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})

app.post('/api/penalty', body.text({ type: '*/*' }), async (req, res) => {
  let data = req.body
  data = data.replace(';', '')
  if (data.includes('*')) { // Creación pomodoro
    const currentPomodoro = await getPomodoro(_userId, _pomodoroId)
    const workTime = currentPomodoro[0].tiempoTrabajo
    const restTime = currentPomodoro[0].tiempoDescanso
    const startDate = new Date(currentPomodoro[0].fechaInicio)
    const info = data.split('*')
    for (let i = 0; i < info.length; i++) {
      const report = info[i].split('$')
      let reverseSeconds
      let reverseMinutes
      if (report[3] === 'T') {
        reverseMinutes = report[0] === workTime ? 0 : workTime - parseInt(report[0]) - 1
        reverseSeconds = report[1] === '00' ? 0 : 60 - parseInt(report[1])
      } else {
        reverseMinutes = report[0] === restTime ? 0 : workTime + restTime - parseInt(report[0]) - 1
        reverseSeconds = report[1] === '00' ? 0 : 60 - parseInt(report[1])
      }
      const newDate = new Date(startDate.getTime() + (reverseMinutes * 60000) * parseInt(report[2]) + (reverseSeconds * 1000))
      const cycleType = report[3] === 'D' ? 1 : 0
      // minutos$segundos$ciclo$trabajo o descanso$penalizacion
      // 0 == trabajo, 1 == descanso
      const _createReport = await createReport(_pomodoroId, report[2], cycleType, report[4], reverseMinutes, reverseSeconds, newDate)
      if (_createReport.length > 0) {
        return res.status(400).send({ message: 'Error creating report' })
      }

      const _resetPenalties = await resetPenalties(_userId)
      if (_resetPenalties.length > 0) {
        return res.status(400).send({ message: 'Error resetting penalties' })
      }
    }
    return res.status(200).send({ message: 'Report saved' })
  } else if (data.includes('D') || data.includes('T')) { // Reporte tiempo real
    const tipos = data.split('$')
    if (tipos[0] === 'D' && tipos[1] === 'S') {
      const _updatePenalties = await updatePenalties(_userId, 0, 1)
      if (_updatePenalties.length > 0) {
        return res.status(400).send({ message: 'Error updating penalties' })
      }
      return res.status(200).send({ message: 'Penalty saved' })
    } else if (tipos[0] === 'T' && tipos[1] === 'N') {
      const _updatePenalties = await updatePenalties(_userId, 1, 0)
      if (_updatePenalties.length > 0) {
        return res.status(400).send({ message: 'Error updating penalties' })
      }
      return res.status(200).send({ message: 'Penalty saved' })
    } else {
      const _updatePenalties = await updatePenalties(_userId, 0, 0)
      if (_updatePenalties.length > 0) {
        return res.status(400).send({ message: 'Error updating penalties' })
      }
      return res.status(200).send({ message: 'No penalty' })
    }
  } else {
    const times = data.split('$')
    const _date = new Date()
    const _createPomodoro = await createPomodoro(_userId, times[0], times[1], _date)
    if (_createPomodoro.length > 0) {
      return res.status(400).send({ message: 'Error creating pomodoro' })
    }
    const _resetPenalties = await resetPenalties(_userId)
    if (_resetPenalties.length > 0) {
      return res.status(400).send({ message: 'Error resetting penalties' })
    }
    _pomodoroId = _createPomodoro.insertId
    return res.status(200).send({ message: 'Pomodoro saved' })
  }
})

app.get('/api/getPenalties', async (req, res) => {
  const _getRealTimePenalties = await getRealTimePenalties(_userId)

  if (_getRealTimePenalties.length > 0) {
    return res.status(200).send({
      penalizacionPararse: _getRealTimePenalties[0].penalizacionPararse,
      penalizacionSentarse: _getRealTimePenalties[0].penalizacionSentarse
    })
  }

  return res.status(400).send({ message: 'Error getting penalties' })
})

app.post('/api/getReporte1And2', async (req, res) => {
  const { date, time } = req.body
  const _queryReport1And2 = await queryReport1And2(_userId, date, time)

  if (_queryReport1And2.length > 0) {
    return res.status(200).send({
      _queryReport1And2
    })
  }
})

app.post('/api/getReporte3', async (req, res) => {
  const { date, time } = req.body
  const _queryReport3 = await queryReport3(_userId, date, time)

  if (_queryReport3.length > 0) {
    return res.status(200).send({
      _queryReport3
    })
  }
})

app.post('/api/getReporte4', async (req, res) => {
  const { date, time } = req.body
  const _queryReport4 = await queryReport4(_userId, date, time)

  if (_queryReport4.length > 0) {
    return res.status(200).send({
      _queryReport4
    })
  }
})

const processDataQuery5And6 = async (queryData) => {
  // unir datos por id
  const dataIds = []
  const joinedData = []
  queryData.forEach((element) => {
    if (dataIds.length === 0) {
      dataIds.push(element.idPomodoro)
    } else {
      if (!dataIds.includes(element.idPomodoro)) {
        dataIds.push(element.idPomodoro)
      }
    }
  })

  dataIds.forEach((id) => {
    const joinedDataAux = []
    queryData.forEach((element) => {
      if (element.idPomodoro === id) {
        joinedDataAux.push(element)
      }
    })
    joinedData.push(joinedDataAux)
  })

  const processedData = []

  joinedData.forEach((element) => {
    const cycleTime = (element[0].tiempoTrabajo + element[0].tiempoDescanso) * 60
    const workTime = element[0].tiempoTrabajo * 60
    const restTime = element[0].tiempoDescanso * 60
    let totalTime1 = 0
    let totalTime2 = 0
    let totalTime3 = 0
    let totalTime4 = 0
    let penaltyStanding1 = 0
    let penaltyStanding2 = 0
    let penaltyStanding3 = 0
    let penaltyStanding4 = 0
    let penaltySitting1 = 0
    let penaltySitting2 = 0
    let penaltySitting3 = 0
    let penaltySitting4 = 0

    element.forEach((_element) => {
      if (_element.ciclo === 1) {
        totalTime1 += _element.tiempoPenalizacion
        if (_element.modo === 0) {
          penaltyStanding1 += _element.tiempoPenalizacion
        } else {
          penaltySitting1 += _element.tiempoPenalizacion
        }
      } else if (_element.ciclo === 2) {
        totalTime2 += _element.tiempoPenalizacion
        if (_element.modo === 0) {
          penaltyStanding2 += _element.tiempoPenalizacion
        } else {
          penaltySitting2 += _element.tiempoPenalizacion
        }
      } else if (_element.ciclo === 3) {
        totalTime3 += _element.tiempoPenalizacion
        if (_element.modo === 0) {
          penaltyStanding3 += _element.tiempoPenalizacion
        } else {
          penaltySitting3 += _element.tiempoPenalizacion
        }
      } else if (_element.ciclo === 4) {
        totalTime4 += _element.tiempoPenalizacion
        if (_element.modo === 0) {
          penaltyStanding4 += _element.tiempoPenalizacion
        } else {
          penaltySitting4 += _element.tiempoPenalizacion
        }
      }
    })

    const porcentajeIncumplimiento1 = (totalTime1 / cycleTime) * 100
    const porcentajeIncumplimiento2 = (totalTime2 / cycleTime) * 100
    const porcentajeIncumplimiento3 = (totalTime3 / cycleTime) * 100
    const porcentajeIncumplimiento4 = (totalTime4 / cycleTime) * 100

    const porcentajeCumplimiento1 = 100 - porcentajeIncumplimiento1
    const porcentajeCumplimiento2 = 100 - porcentajeIncumplimiento2
    const porcentajeCumplimiento3 = 100 - porcentajeIncumplimiento3
    const porcentajeCumplimiento4 = 100 - porcentajeIncumplimiento4

    const porcentajePenalizacionParado1 = (penaltyStanding1 / workTime) * 100
    const porcentajePenalizacionParado2 = (penaltyStanding2 / workTime) * 100
    const porcentajePenalizacionParado3 = (penaltyStanding3 / workTime) * 100
    const porcentajePenalizacionParado4 = (penaltyStanding4 / workTime) * 100

    const porcentajePenalizacionSentado1 = (penaltySitting1 / restTime) * 100
    const porcentajePenalizacionSentado2 = (penaltySitting2 / restTime) * 100
    const porcentajePenalizacionSentado3 = (penaltySitting3 / restTime) * 100
    const porcentajePenalizacionSentado4 = (penaltySitting4 / restTime) * 100

    processedData.push({
      idPomodoro: element[0].idPomodoro,
      porcentajeCumplimiento1,
      porcentajeIncumplimiento1,
      porcentajePenalizacionParado1,
      porcentajePenalizacionSentado1,
      porcentajeCumplimiento2,
      porcentajeIncumplimiento2,
      porcentajePenalizacionParado2,
      porcentajePenalizacionSentado2,
      porcentajeCumplimiento3,
      porcentajeIncumplimiento3,
      porcentajePenalizacionParado3,
      porcentajePenalizacionSentado3,
      porcentajeCumplimiento4,
      porcentajeIncumplimiento4,
      porcentajePenalizacionParado4,
      porcentajePenalizacionSentado4
    })
  })

  return processedData
}

app.post('/api/reporte5', async (req, res) => {
  const { date, time } = req.body
  const _queryReport5And6 = await queryReport5And6(_userId, date, time)
  if (_queryReport5And6.length > 0) {
    const report5Data = await processDataQuery5And6(_queryReport5And6)
    return res.status(200).send({
      reportData: report5Data
    })
  }
  return res.status(400).send({ message: 'Error getting report 5' })
})

app.post('/api/reporte6', async (req, res) => {
  const { date, time } = req.body
  const _queryReport5And6 = await queryReport5And6(_userId, date, time)
  if (_queryReport5And6.length > 0) {
    const processedData = await processDataQuery5And6(_queryReport5And6)
    const report6Data = []
    processedData.forEach((element) => {
      const porcentajeCumplimientoPromedio =
        (element.porcentajeCumplimiento1 +
          element.porcentajeCumplimiento2 +
          element.porcentajeCumplimiento3 +
          element.porcentajeCumplimiento4) /
        4
      const porcentajeIncumplimientoPromedio =
        (element.porcentajeIncumplimiento1 +
          element.porcentajeIncumplimiento2 +
          element.porcentajeIncumplimiento3 +
          element.porcentajeIncumplimiento4) /
        4

      const porcentajePenalizacionParadoPromedio =
        (element.porcentajePenalizacionParado1 +
          element.porcentajePenalizacionParado2 +
          element.porcentajePenalizacionParado3 +
          element.porcentajePenalizacionParado4) /
        4

      const porcentajePenalizacionSentadoPromedio =
        (element.porcentajePenalizacionSentado1 +
          element.porcentajePenalizacionSentado2 +
          element.porcentajePenalizacionSentado3 +
          element.porcentajePenalizacionSentado4) /
        4

      report6Data.push({
        idPomodoro: element.idPomodoro,
        porcentajeCumplimientoPromedio,
        porcentajeIncumplimientoPromedio,
        porcentajePenalizacionParadoPromedio,
        porcentajePenalizacionSentadoPromedio
      })
    })

    return res.status(200).send({
      reportData: report6Data
    })
  }
  return res.status(400).send({ message: 'Error getting report 6' })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
