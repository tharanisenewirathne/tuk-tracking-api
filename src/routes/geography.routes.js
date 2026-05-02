const express = require("express");
const router = express.Router();

const geoController = require("../controllers/geography.controller");
const verifyToken = require("../middlewares/auth.middleware");

// Provinces
router.get("/provinces", verifyToken, geoController.getProvinces);

// Districts by province
router.get("/districts/:provinceId", verifyToken, geoController.getDistricts);

// Stations by district
router.get("/stations/:districtId", verifyToken, geoController.getStations);

module.exports = router;