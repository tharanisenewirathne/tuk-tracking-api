const Geography = require("../models/geography.model");

exports.getProvinces = (req, res) => {
    Geography.getProvinces((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getDistricts = (req, res) => {
    Geography.getDistrictsByProvince(req.params.provinceId, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getStations = (req, res) => {
    Geography.getStationsByDistrict(req.params.districtId, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};