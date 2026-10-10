const mysql = require("mysql2");

// A connection pool instead of a single connection:
// - dropped connections are replaced automatically, so the server no longer
//   crashes when the cloud database closes an idle connection
// - several queries can run at the same time
// It keeps the same db.query(...) and db.promise() interface as before.
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true,
    // Hosted MySQL services such as Aiven require SSL. Set DB_SSL=true there.
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined
});

// Check the connection once at startup (does not stop the server if it fails).
db.getConnection((err, conn) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to MySQL");
        conn.release();
    }
});

module.exports = db;
