const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */



 /**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (HQ / Province / District officer)
 *     tags: [Auth]
 *     description: |
 *       Creates a user and automatically assigns a police station based on role:
 *       - HQ_ADMIN → National HQ
 *       - PROVINCE_OFFICER → Provincial HQ
 *       - DISTRICT_OFFICER → District HQ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, role]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin01
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [HQ_ADMIN, PROVINCE_OFFICER, DISTRICT_OFFICER]
 *                 example: DISTRICT_OFFICER
 *               province:
 *                 type: string
 *                 example: Western
 *               district:
 *                 type: string
 *                 example: Colombo
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server error
 */
router.post("/register", authController.register);

 /**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Auth]
 *     description: |
 *       Authenticates user and returns JWT token with role and police station mapping.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin01
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: JWT token returned
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authController.login);

module.exports = router;