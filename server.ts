import express from "express"
import { pool } from "./db.js"

const app = express()
const PORT = 4000

app.use(express.json())

// INIT DB
async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL
    )
  `)
}

// GET /
app.get("/", (req, res) => {
  res.json({ message: "API running" })
})

// GET /users
app.get("/users", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users")
  res.json(rows)
})

// GET /users/:id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params
  const [rows]: any = await pool.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  )
  res.json(rows[0] || null)
})

// POST /users
app.post("/users", async (req, res) => {
  const { name, email } = req.body

  const [result]: any = await pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  )

  res.json({ id: result.insertId, name, email })
})

// PUT /users/:id
app.put("/users/:id", async (req, res) => {
  const { id } = req.params
  const { name, email } = req.body

  await pool.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id]
  )

  res.json({ id, name, email })
})

// DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params

  await pool.query("DELETE FROM users WHERE id = ?", [id])

  res.json({ success: true })
})

// START
app.listen(PORT, async () => {
  await initDatabase()
  console.log(` Server running on http://localhost:${PORT}`)
})
