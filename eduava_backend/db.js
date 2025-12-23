// db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 5
});

// 🔴 IMPORTANT: force test connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected (Supabase)");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    process.exit(1); // backend hi band kar do agar DB nahi mila
  }
})();

export default pool;
