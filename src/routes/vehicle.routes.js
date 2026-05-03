const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicle.controller");

const verifyToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const filterByRole = require("../middlewares/dataFilter.middleware");

// CREATE vehicle (only HQ + PROVINCIAL)
/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create new tuk-tuk vehicle
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Vehicles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registration_number:
 *                 type: string
 *               district:
 *                 type: string
 *               province:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle created
 */

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


/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get vehicles based on user role and geography
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Vehicles
 *     responses:
 *       200:
 *         description: List of vehicles
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    verifyToken,
    filterByRole,
    vehicleController.getAllVehicles
);

module.exports = router;