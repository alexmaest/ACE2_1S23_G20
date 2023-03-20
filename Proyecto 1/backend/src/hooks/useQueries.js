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

const updatePenalties = async (userId, isStanding) => {
  if (isStanding) {
    const rows = await pool.query(
      'UPDATE Usuario SET penalizacionPararse = penalizacionPararse + 1 WHERE idUsuario = ?',
      [userId])
    return rows[0]
  } else {
    const rows = await pool.query(
      'UPDATE Usuario SET penalizacionSentarse = penalizacionSentarse + 1 WHERE idUsuario = ?',
      [userId])
    return rows[0]
  }
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

export { registerUser, loginUser, updatePenalties, createPomodoro, createReport, getPomodoro }
