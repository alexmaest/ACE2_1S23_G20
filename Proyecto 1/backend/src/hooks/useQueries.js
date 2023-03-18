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

export { registerUser, loginUser }
