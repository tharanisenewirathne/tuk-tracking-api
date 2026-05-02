const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicle.controller");

const verifyToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const filterByRole = require("../middlewares/dataFilter.middleware");

// CREATE vehicle (only HQ + PROVINCIAL)
router.post(
    "/",
    verifyToken,
    authorizeRoles("HQ_ADMIN", "PROVINCIAL_OFFICER"),
    vehicleController.createVehicle
);


// filter by district
router.get("/district/:district", verifyToken, vehicleController.getByDistrict);

// filter by province
router.get("/province/:province", verifyToken, vehicleController.getByProvince);

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

router.get(
    "/",
    verifyToken,
    filterByRole,
    vehicleController.getAllVehicles
);

module.exports = router;