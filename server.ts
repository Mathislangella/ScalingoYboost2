import express from 'express'
import { pool } from './db.js'  // ⚠️ avec .js pour NodeNext

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

// Fonction pour créer la table si elle n'existe pas
async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL
    )
  `)
  console.log('✅ Table "users" prête.')
}

// Fonction pour insérer des utilisateurs de seed
async function seedDatabase() {
  await pool.query(`
    INSERT INTO users (name, password, email)
    VALUES 
      ('Matis', 'motdepasse123', 'matis@example.com'),
      ('Alice', 'alice123', 'alice@example.com')
    ON CONFLICT DO NOTHING
  `)
  console.log('✅ Seed users insérés.')
}

// Initialisation complète
async function init() {
  try {
    await initDatabase()
    await seedDatabase()
  } catch (err) {
    console.error('Erreur init DB :', err)
  }
}

// Routes simples
app.get('/', (req, res) => {
  res.json({ message: 'API running' })
})

app.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users')
  res.json(rows)
})

// Démarrage serveur
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  await init() // ⚡ Init DB + seed au démarrage
})
