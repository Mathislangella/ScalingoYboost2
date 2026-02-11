import express from "express";
import { pool } from "./db.js";
const app = express();
// ⚠️ OBLIGATOIRE sur Scalingo
const PORT = process.env.PORT || 3000;
app.use(express.json());
// route test DB
app.get("/", async (_req, res) => {
    try {
        const { rows } = await pool.query("SELECT NOW()");
        res.json({
            success: true,
            time: rows[0],
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});
app.listen(PORT, () => {
    console.log("🚀 Server running on port", PORT);
});
