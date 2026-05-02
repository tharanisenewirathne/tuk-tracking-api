const express = require("express");
const cors = require("cors");

require("./config/db");

const authRoutes = require("./routes/auth.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const locationRoutes = require("./routes/location.routes");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/locations", locationRoutes);

app.get("/", (req, res) => {
    res.send("Tuk-Tuk Tracking API Running...");
});

module.exports = app;