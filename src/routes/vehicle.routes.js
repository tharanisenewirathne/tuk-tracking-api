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

// filter by district
router.get("/district/:district", vehicleController.getByDistrict);

// filter by province
router.get("/province/:province", vehicleController.getByProvince);

router.get(
    "/with-latest-location",
    verifyToken,
    vehicleController.getWithLatestLocation
);

router.get(
    "/district/:district/live",
    verifyToken,
    vehicleController.getDistrictWithLocation
);

module.exports = router;