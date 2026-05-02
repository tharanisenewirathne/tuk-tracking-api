const express = require("express");
const router = express.Router();

const locationController = require("../controllers/location.controller");

// Add GPS ping
router.post("/", locationController.addLocation);

// Get history
router.get("/:vehicleId/history", locationController.getHistory);

// Get latest location
router.get("/:vehicleId/latest", locationController.getLatest);

module.exports = router;