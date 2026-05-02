const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicle.controller");

// Create vehicle
router.post("/", vehicleController.createVehicle);

// Get all vehicles
router.get("/", vehicleController.getAllVehicles);

module.exports = router;