// Creates all tables from database/schema.sql.
// Usage: node scripts/initDb.js   (reads DB_* settings from .env)
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function main() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        multipleStatements: true,
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined
    });

    const sql = fs.readFileSync(path.join(__dirname, "..", "database", "schema.sql"), "utf8");
    await conn.query(sql);

    const [tables] = await conn.query("SHOW TABLES");
    console.log("Tables ready:", tables.map((t) => Object.values(t)[0]).join(", "));
    await conn.end();
}

main().catch((err) => {
    console.error("Database setup failed:", err.message);
    process.exit(1);
});
