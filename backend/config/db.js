require("dotenv").config(); // Ensure variables are loaded
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // Keep connections alive and auto-recover from Neon's idle timeouts
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
  max: 10,
});

// ✅ Prevent unhandled 'error' event from crashing the server
// Neon (serverless Postgres) may drop idle connections — this handles it gracefully
pool.on("error", (err) => {
  console.error("⚠️ Unexpected PostgreSQL pool error (connection dropped):", err.message);
  // Do NOT re-throw — allow the pool to recover automatically
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Neon PostgreSQL connected successfully");
    release(); // ✅ Always release the client back to the pool
  }
});

module.exports = pool;