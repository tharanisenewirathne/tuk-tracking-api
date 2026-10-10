const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const bootstrap = require("./config/bootstrap");
const authRoutes = require("./routes/auth.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const locationRoutes = require("./routes/location.routes");
const geographyRoutes = require("./routes/geography.routes");

const app = express();

// Create tables and sample data automatically on first start (safe to repeat)
const dbReady = bootstrap().catch((err) => {
    console.error("Database setup failed:", err.message);
});

app.use(cors());
app.use(express.json());

// Wait for the database setup to finish before handling API requests
app.use("/api", async (req, res, next) => {
    await dbReady;
    next();
});

// Swagger UI files are loaded from a CDN so the docs page also works on
// serverless hosts such as Vercel
const SWAGGER_CDN = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.5";
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customCssUrl: `${SWAGGER_CDN}/swagger-ui.css`,
        customJs: [
            `${SWAGGER_CDN}/swagger-ui-bundle.js`,
            `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`
        ]
    })
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/geography", geographyRoutes);

app.get("/", (req, res) => {
    res.send("Tuk-Tuk Tracking API Running...");
});

module.exports = app;
