import mysql from "mysql2/promise"

export const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 8889,
  user: "root",
  password: "root",
  database: "yboost2",
})
