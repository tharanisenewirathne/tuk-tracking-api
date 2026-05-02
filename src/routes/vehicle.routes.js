const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicle.controller");

const verifyToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

// CREATE vehicle (only HQ + PROVINCIAL)
router.post(
    "/",
    verifyToken,
    authorizeRoles("HQ_ADMIN", "PROVINCIAL_OFFICER"),
    vehicleController.createVehicle
);

// GET vehicles (all authenticated users)
router.get(
    "/",
    verifyToken,
    vehicleController.getAllVehicles
);

module.exports = router;