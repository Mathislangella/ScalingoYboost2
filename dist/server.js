import express from "express";
import { pool } from "./db.js";
const app = express();
const PORT = Number(process.env.PORT) || 4000;
app.use(express.json());
// initialise la table
async function initDatabase() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      birthdate DATE
    )
  `);
    console.log('✅ Table "users" prête.');
}
// route test DB
app.get("/", async (_req, res) => {
    console.log("GET /");
    await initDatabase();
    res.json({ message: "Database initialized successfully" });
});
// GET all users
app.get("/users", async (_req, res) => {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json(rows);
});
// GET user by ID
app.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const { rows } = await pool.query("SELECT id, username, email, birthdate FROM users WHERE id = $1", [id]);
    res.json(rows);
});
// GET user by username via query
app.get("/users/by-username", async (req, res) => {
    const username = req.query.username;
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    res.json(rows);
});
// CREATE user
app.post("/users", async (req, res) => {
    const { username, password, email, birthdate } = req.body;
    await pool.query("INSERT INTO users (username, password, email, birthdate) VALUES ($1, $2, $3, $4)", [username, password, email, birthdate]);
    res.json({ username, email, birthdate });
});
// UPDATE user
app.put("/users", async (req, res) => {
    const { username, birthdate } = req.body;
    await pool.query("UPDATE users SET birthdate = $1 WHERE username = $2", [birthdate, username]);
    res.json({ username, birthdate });
});
// DELETE user
app.delete("/users", async (req, res) => {
    const { username } = req.body;
    await pool.query("DELETE FROM users WHERE username = $1", [username]);
    res.json({ success: `${username} deleted` });
});
// écoute
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
