import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'dbp1.cbfly0lletjb.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'Guatemala2023',
  database: 'proyecto1_ace1_db',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  port: 3306
})

export default pool
