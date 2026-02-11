import express from "express"
import { pool } from "./db.js"

const app = express()
const PORT = 4000

app.use(express.json())

// ---------- INIT DATABASE ----------
async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      birthdate DATE
    )
  `)

  console.log('✅ Table "users" prête.')
}

// ---------- DEBUG DB ----------
app.get("/debug-db", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()")
    res.json({
      success: true,
      dbTime: rows[0],
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      error: "DB connection failed",
    })
  }
})

// ---------- ROUTES USERS ----------

// GET all users
app.get("/users", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM users")
  res.json(rows)
})

// GET user by id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params

  const { rows } = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  )

  res.json(rows[0] ?? null)
})

// CREATE user
app.post("/users", async (req, res) => {
  const { username, birthdate } = req.body

  const { rows } = await pool.query(
    "INSERT INTO users (username, birthdate) VALUES ($1, $2) RETURNING *",
    [username, birthdate]
  )

  res.status(201).json(rows[0])
})

// UPDATE user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params
  const { username, birthdate } = req.body

  const { rows } = await pool.query(
    "UPDATE users SET username = $1, birthdate = $2 WHERE id = $3 RETURNING *",
    [username, birthdate, id]
  )

  res.json(rows[0] ?? null)
})

// DELETE user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params

  await pool.query("DELETE FROM users WHERE id = $1", [id])

  res.json({ success: true })
})

// ---------- START SERVER ----------
async function start() {
  try {
    await initDatabase()

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("❌ Failed to start server:", err)
  }
}

start()
