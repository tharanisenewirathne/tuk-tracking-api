const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicle.controller");

const verifyToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const filterByRole = require("../middlewares/dataFilter.middleware");


/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Tuk-Tuk vehicle management and tracking
 */

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [registration_number, province, district]
 *             properties:
 *               registration_number:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    verifyToken,
    authorizeRoles("HQ_ADMIN", "PROVINCIAL_OFFICER"),
    vehicleController.createVehicle
);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get vehicles with role-based filtering
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Filter by district
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter by province
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

router.get(
    "/district/:district",
    verifyToken,
    filterByRole,
    vehicleController.getByDistrict
);

router.get(
    "/province/:province",
    verifyToken,
    filterByRole,
    vehicleController.getByProvince
);

/**
 * @swagger
 * /api/vehicles/with-latest-location:
 *   get:
 *     summary: Get all vehicles with their latest GPS location (role-based access controlled)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: province
 *         required: false
 *         schema:
 *           type: string
 *         description: |
 *           Allowed only for HQ_ADMIN and PROVINCIAL_OFFICER.
 *
 *       - in: query
 *         name: district
 *         required: false
 *         schema:
 *           type: string
 *         description: |
 *           District Based Filter.
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved vehicles with latest location
 *
 *       401:
 *         description: Unauthorized (No token or invalid token)
 *
 *       403:
 *         description: Forbidden (Role-based access restriction violated)
 */
router.get(
    "/with-latest-location",
    verifyToken,
    filterByRole,
    vehicleController.getWithLatestLocation
);


router.get(
    "/district/:district/live",
    verifyToken,
    filterByRole,
    vehicleController.getDistrictWithLocation
);



module.exports = router;