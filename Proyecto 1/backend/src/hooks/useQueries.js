import pool from '../services/dbConnection.js'

const registerUser = async (userName, fullName, password) => {
  const rows = await pool.query(
    'INSERT INTO Usuario(userName, fullName, password, penalizacionPararse, penalizacionSentarse) VALUES(?, ?, ?, 0, 0)',
    [userName, fullName, password])
  return rows[0]
}

const loginUser = async (userName, password) => {
  const rows = await pool.query(
    'SELECT * FROM Usuario WHERE userName = ? AND password = ?',
    [userName, password])
  return rows[0]
}

const updatePenalties = async (userId, isStanding, isSeated) => {
  const rows = await pool.query(
    'UPDATE Usuario SET penalizacionPararse = ?, penalizacionSentarse = ? WHERE idUsuario = ?',
    [userId, isStanding, isSeated])
  return rows[0]
}

const createPomodoro = async (userId, pomodoroTime, restTime, date) => {
  const rows = await pool.query(
    'INSERT INTO Pomodoro(idUsuario, tiempoTrabajo, tiempoDescanso, fechaInicio) VALUES(?, ?, ?, ?)',
    [userId, pomodoroTime, restTime, date])
  return rows[0]
}

const getPomodoro = async (userId, pomodoroId) => {
  const rows = await pool.query(
    'SELECT * FROM Pomodoro WHERE idUsuario = ? AND idPomodoro = ?',
    [userId, pomodoroId])
  return rows[0]
}

const createReport = async (pomodoroId, cycle, mode, penaltyTime, min, sec, date) => {
  const rows = await pool.query(
    'INSERT INTO Reporte(idPomodoro, ciclo, modo, tiempoPenalizacion, minuto, segundo, fechaDato) VALUES(?, ?, ?, ?, ?, ?, ?)',
    [pomodoroId, cycle, mode, penaltyTime, min, sec, date])
  return rows[0]
}

const getRealTimePenalties = async (userId) => {
  console.log({ userId })
  const rows = await pool.query(
    'SELECT penalizacionPararse, penalizacionSentarse FROM Usuario WHERE idUsuario = ?', [userId]
  )
  return rows[0]
}

const resetPenalties = async (userId) => {
  const rows = await pool.query(
    'UPDATE Usuario SET penalizacionPararse = 0, penalizacionSentarse = 0 WHERE idUsuario = ?',
    [userId])
  return rows[0]
}

const queryReport1And2 = async (userId, date, time) => {
  console.log({ userId, date, time })
  const rows = await pool.query(
    `SELECT
    idPomodoro,
    ciclo,
    (SELECT fechaInicio FROM Pomodoro WHERE idPomodoro = r.idPomodoro) AS fechaInicio,
    SUM(CASE WHEN modo = 0 THEN tiempoPenalizacion ELSE 0 END) AS penalizacionTiempoTrabajo,
    SUM(CASE WHEN modo = 1 THEN tiempoPenalizacion ELSE 0 END) AS penalizacionTiempoDescanso
    FROM Reporte r WHERE DATE_FORMAT(fechaDato, '%Y-%m-%d %H:%i:%s')
    BETWEEN ? AND NOW() AND idPomodoro IN (SELECT idPomodoro FROM Pomodoro WHERE idUsuario = ?)
    GROUP BY idPomodoro, ciclo`, [`${date} ${time}`, userId])
  console.log(rows[0])
  return rows[0]
}

const queryReport3 = async (userId, date, time) => {
  const rows = await pool.query(
    `SELECT
    idPomodoro,
    ciclo,
    (SELECT fechaInicio FROM Pomodoro WHERE idPomodoro = r.idPomodoro) AS fechaInicio,
    tiempoPenalizacion AS tiempoParadoEnTrabajo,
    fechaDato
    FROM Reporte r WHERE DATE_FORMAT(fechaDato, '%Y-%m-%d %H:%i:%s')
    BETWEEN ? AND NOW() AND idPomodoro IN (SELECT idPomodoro FROM Pomodoro WHERE idUsuario = ? AND modo = 0)`,
    [`${date} ${time}`, userId]
  )
  console.log(rows[0])
  return rows[0]
}

const queryReport4 = async (userId, date, time) => {
  const rows = await pool.query(
    `SELECT
    idPomodoro,
    ciclo,
    (SELECT fechaInicio FROM Pomodoro WHERE idPomodoro = r.idPomodoro) AS fechaInicio,
    tiempoPenalizacion AS tiempoParadoEnTrabajo,
    fechaDato
    FROM Reporte r WHERE DATE_FORMAT(fechaDato, '%Y-%m-%d %H:%i:%s')
    BETWEEN ? AND NOW() AND idPomodoro IN (SELECT idPomodoro FROM Pomodoro WHERE idUsuario = ? AND modo = 1)`,
    [`${date} ${time}`, userId]
  )
  console.log(rows[0])
  return rows[0]
}

export {
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
  queryReport4
}
