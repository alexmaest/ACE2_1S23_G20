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

const updatePenalties = async (userId, penaltyStand, penaltySit) => {
  const rows = await pool.query(
    'UPDATE Usuario SET penalizacionPararse = ?, penalizacionSentarse = ? WHERE idUsuario = ?',
    [penaltyStand, penaltySit, userId])
  return rows[0]
}

const createPomodoro = async (userId, pomodoroTime, restTime) => {
  const rows = await pool.query(
    'INSERT INTO Pomodoro(idUsuario, tiempoTrabajo, tiempoDescanso) VALUES(?, ?, ?)',
    [userId, pomodoroTime, restTime])
  return rows[0]
}

const createReport = async (pomodoroId, cycle, mode, penaltyTime, min, sec) => {
  const rows = await pool.query(
    'INSERT INTO Reporte(idPomodoro, ciclo, modo, tiempoPenalizacion, minuto, segundo) VALUES(?, ?, ?, ?, ?, ?)',
    [pomodoroId, cycle, mode, penaltyTime, min, sec])
  return rows[0]
}

const getRealTimePenalties = async (userId) => {
  console.log({ userId })
  const rows = await pool.query(
    'SELECT penalizacionPararse, penalizacionSentarse FROM Usuario WHERE idUsuario = ?', [userId]
  )
  return rows[0]
}

export { registerUser, loginUser, updatePenalties, createPomodoro, createReport, getRealTimePenalties }
