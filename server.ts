// server.ts
import express from 'express'
import { pool } from './db.js'

const app = express()
const PORT = process.env.PORT || 4000

// Initialisation de la DB
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
      )
    `)
    console.log('✅ Table "users" prête.')
  } catch (err) {
    console.error('Erreur init DB:', err)
  }
}

// Middleware JSON
app.use(express.json())

// Routes
app.get('/', async (req, res) => {
  await initDatabase()
  res.json({ message: "Database initialized successfully" })
})

app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users")
    res.json(rows)
  } catch (err) {
    console.error('Erreur GET /users:', err)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
