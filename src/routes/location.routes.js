const express = require("express");
const router = express.Router();

const locationController = require("../controllers/location.controller");
const verifyToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const filterByRole = require("../middlewares/dataFilter.middleware");

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: GPS tracking endpoints
 */



/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Send GPS location (from tracking device)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicle_id, latitude, longitude]
 *             properties:
 *               vehicle_id:
 *                 type: integer
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               speed:
 *                 type: number
 *     responses:
 *       201:
 *         description: Location recorded
 */
// Add GPS ping
router.post("/", verifyToken, locationController.addLocation);


/**
 * @swagger
 * /api/locations/{vehicleId}/history:
 *   get:
 *     summary: Get vehicle location history (last 7 days default)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (max 7 days range)
 *
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (max 7 days range)
 *
 *     responses:
 *       200:
 *         description: Vehicle location history
 *       403:
 *         description: Forbidden (role-based access)
 *       401:
 *         description: Unauthorized
 */
// Get history
router.get(
    "/:vehicleId/history",
    verifyToken,
    filterByRole,
    locationController.getHistory
);


// Get latest location
router.get("/:vehicleId/latest", verifyToken, locationController.getLatest);

module.exports = router;