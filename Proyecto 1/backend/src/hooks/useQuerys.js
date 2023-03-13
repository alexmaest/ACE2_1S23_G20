import pool from '../services/dbconnection.js'

const registerUser = async (username, fullname, password) => {
  const rows = await pool.query(
    'INSERT INTO usuario (username, fullname, password) VALUES (?, ?, ?)',
    [username, fullname, password])
  return rows[0]
}

const loginUser = async (username, password) => {
  const rows = await pool.query(
    'SELECT * FROM usuario WHERE username = ? AND password = ?',
    [username, password])
  return rows[0]
}

export { registerUser, loginUser }
