const express = require("express");
const router = express.Router();

const geoController = require("../controllers/geography.controller");

// Provinces
router.get("/provinces", geoController.getProvinces);

// Districts by province
router.get("/districts/:provinceId", geoController.getDistricts);

// Stations by district
router.get("/stations/:districtId", geoController.getStations);

module.exports = router;