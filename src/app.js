const express = require("express");
const cors = require("cors");


const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/auth.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const locationRoutes = require("./routes/location.routes");
const geographyRoutes = require("./routes/geography.routes");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/geography", geographyRoutes);

app.get("/", (req, res) => {
    res.send("Tuk-Tuk Tracking API Running...");
});

module.exports = app;