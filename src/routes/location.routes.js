const express = require("express");
const router = express.Router();

const locationController = require("../controllers/location.controller");
const verifyToken = require("../middlewares/auth.middleware");

// Add GPS ping
router.post("/", verifyToken, locationController.addLocation);

// Get history
router.get("/:vehicleId/history", verifyToken, locationController.getHistory);

// Get latest location
router.get("/:vehicleId/latest", verifyToken, locationController.getLatest);

module.exports = router;