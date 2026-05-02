const Vehicle = require("../models/vehicle.model");

exports.createVehicle = (req, res) => {
    Vehicle.create(req.body, (err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.status(201).json({
            message: "Vehicle registered successfully"
        });
    });
};

exports.getAllVehicles = (req, res) => {
    Vehicle.getAll((err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });
};

exports.getByDistrict = (req, res) => {
    Vehicle.getByDistrict(req.params.district, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getByProvince = (req, res) => {
    Vehicle.getByProvince(req.params.province, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getWithLatestLocation = (req, res) => {
    Vehicle.getWithLatestLocation((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getDistrictWithLocation = (req, res) => {
    Vehicle.getByDistrictWithLocation(req.params.district, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};