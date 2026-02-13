import express from "express";
import { pool } from "./db.js";
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
// ---------- INIT TABLE ----------
async function initDatabase() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE
    )
  `);
}
// ---------- SEED ----------
async function seedDatabase() {
    await pool.query(`
    INSERT IGNORE INTO users (name, password, email)
    VALUES 
      ('Matis', 'motdepasse123', 'matis@example.com'),
      ('Alice', 'alice123', 'alice@example.com')
  `);
    console.log("✅ Seed users insérés.");
}
// ---------- INIT GLOBAL ----------
async function init() {
    try {
        await initDatabase();
        await seedDatabase();
    }
    catch (err) {
        console.error("Erreur init DB :", err);
    }
}
// ---------- ROUTES ----------
app.get("/", (_, res) => {
    res.json({ message: "API running" });
});
app.get("/users", async (_, res) => {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
});
// ---------- START ----------
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await init();
});
