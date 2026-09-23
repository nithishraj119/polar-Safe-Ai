const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let pool = null;
let isConnected = false;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'polar_safe_ai',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 3000
  });
} catch (err) {
  console.warn('⚠️ [POLAR-SAFE DB] Failed to create MySQL pool:', err.message);
}

// Check database connection
const checkConnection = async () => {
  if (!pool) {
    isConnected = false;
    return false;
  }
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isConnected = true;
    return true;
  } catch (err) {
    isConnected = false;
    return false;
  }
};

// Safe execute query helper with parameterized arguments
const query = async (sql, params = []) => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  const [results] = await pool.execute(sql, params);
  return results;
};

// Initial test on startup
checkConnection().then((connected) => {
  if (connected) {
    console.log('✅ [POLAR-SAFE DB] MySQL database connected successfully.');
  } else {
    console.warn('⚠️ [POLAR-SAFE DB] MySQL is currently unreachable. Operating in fallback simulated mode.');
  }
});

module.exports = {
  pool,
  query,
  checkConnection,
  getConnectionStatus: () => isConnected
};
