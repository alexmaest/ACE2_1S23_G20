import express from 'express'
import cors from 'cors'
import body from 'body-parser'
import { registerUser, loginUser } from './hooks/useQuerys.js'

let _rest = ''
let _pomoData = ''

const app = express()

app.use(body.urlencoded({ extended: false }))
app.use(body.json())
const port = 3555

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/register', async (req, res) => {
  const { username, fullname, password } = req.body

  const _registerUser = await registerUser(username, fullname, password)

  if (_registerUser.length > 0) {
    return res.status(400).send({ message: 'User already exists' })
  }

  res.status(200).send({ message: 'User registered' })
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  const _loginUser = await loginUser(username, password)

  if (_loginUser.length > 0) {
    return res.status(200).send({
      id: _loginUser[0].user_id,
      name: _loginUser[0].username,
      fullname: _loginUser[0].fullname
    })
  }

  return res.status(400).send({ message: 'Invalid password or username' })
})

app.post('/api/sendRest', async (req, res) => {
  const { rest } = req.body
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
      _pomoData = data
      res.status(200).send({ pomoData: _pomoData })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})

app.post('/api/penality', async (req, res) => {
  // TODO: Add penality to user

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
