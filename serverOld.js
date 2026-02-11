// l  'ennsemble des imports
import express from 'express'
import { pool } from './db'
// Constante
const app = express()
const PORT = 4000

const users = []

async function initDatabase() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
      )`);
    console.log('✅ Table "users" prête.');
}

app.use(express.json())

// logique "métier"
app.get('/', async (req, res) => {
    console.log("test route users")
    initDatabase();
    // const [rows] = await pool.query("SELECT * FROM users")
    res.json({message: "Database initialized successfully"})
})
app.get('/users', async (req, res) => {
    console.log("test route users")

    const [rows] = await pool.query(`SELECT * FROM users`);
    res.json(rows)
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    console.log("test route users")

    const [rows] = await pool.query(
        "SELECT id, email, name FROM users where id = ?",
        [id]
    )

    res.status(200).json(rows)
})

app.get('/users/:username', async (req, res) => {
    const { username } = req.query

    const [rows] = await pool.query( 
        "SELECT * FROM users WHERE username = ?",
        [username]
    )

  res.json(rows)

})

app.put('/users', async (req, res) => {
    const { username, birthdate } = req.body
    const [rows] = await pool.query(
        "UPDATE users SET birthdate = ? WHERE username = ?",
        [birthdate, username]
    )
    res.json({id: "", username, birthdate})
})

app.post('/users', async (req, res) => {
    const { username, birthdate } = req.body
    const [rows] = await pool.query(
        "INSERT INTO users (username, birthdate) VALUES (?, ?)",
        [username, birthdate]
    )
    res.json({id: "", username, birthdate})
})

app.delete('/users', async (req, res) => {
    const { username } = req.body
    const [rows] = await pool.query(
        "DELETE FROM users WHERE username = ?",
        [username]
    )
    res.json({success : username + " deleted"})
})

// écoute sur un port
app.listen(PORT, () => {    
    console.log(`server running on localhost:${PORT}`)
})