const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Optional: check if DB connection works
pool.connect()
  .then(() => {
    console.log("PostgreSQL connected successfully");
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err);
  });

const getResearchCalls = async () => {
  try {
    const query = `
      SELECT 
        symbol,
        display_name,
        action,
        call_type,
        entry_price,
        target_price,
        stop_loss,
        created_at
      FROM research_calls
      WHERE is_latest = true
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {
    console.error("Error fetching research calls:", error);
    throw error;
  }
};

module.exports = {
  pool,
  getResearchCalls
};