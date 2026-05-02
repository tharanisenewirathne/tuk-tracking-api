const express = require("express");
const cors = require("cors");

require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Tuk-Tuk Tracking API Running...");
});
module.exports = app;