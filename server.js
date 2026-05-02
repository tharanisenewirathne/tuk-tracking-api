require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const basicAuth = require("express-basic-auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Auth (security)
app.use(basicAuth({
    users: {
        [process.env.AUTH_USER]: process.env.AUTH_PASS
    },
    challenge: true
}));

// DB connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("DB error:", err);
    } else {
        console.log("DB connected");
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});