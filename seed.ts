
import { pool } from './db.js'  // attention à bien mettre .js

async function main() {
  try {
    await pool.query(`
      INSERT INTO users (name, password, email)
      VALUES 
      ('Matis', 'motdepasse123', 'matis@example.com'),
      ('Alice', 'alice123', 'alice@example.com');
    `)
    console.log("Users insérés !")
    process.exit(0)
  } catch (err) {
    console.error("Erreur insertion :", err)
    process.exit(1)
  }
}

main()
