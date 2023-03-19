import express from 'express'
import cors from 'cors'
import body from 'body-parser'
import { registerUser, loginUser, updatePenalties, createPomodoro, createReport } from './hooks/useQueries.js'

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
    const info = data.split('*')
    for (let i = 0; i < info.length; i++) {
      const report = info[i].split('$')
      const cycleType = report[3] === 'D' ? 1 : 0
      // minutos$segundos$ciclo$trabajo o descanso$penalizacion
      // 0 == trabajo, 1 == descanso
      const _createReport = await createReport(_pomodoroId, report[2], cycleType, report[4], report[0], report[1])
      if (_createReport.length > 0) {
        return res.status(400).send({ message: 'Error creating report' })
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
      return res.status(200).send({ message: 'Penalty saved' })
    }
  } else {
    const times = data.split('$')
    const _createPomodoro = await createPomodoro(_userId, times[0], times[1])
    if (_createPomodoro.length > 0) {
      return res.status(400).send({ message: 'Error creating pomodoro' })
    }
    _pomodoroId = _createPomodoro.insertId
    return res.status(200).send({ message: 'Pomodoro saved' })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
