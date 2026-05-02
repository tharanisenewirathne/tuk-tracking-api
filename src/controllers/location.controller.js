const Location = require("../models/location.model");

exports.addLocation = (req, res) => {
    Location.create(req.body, (err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.status(201).json({
            message: "Location recorded successfully"
        });
    });
};

exports.getHistory = (req, res) => {
    Location.getByVehicle(req.params.vehicleId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });
};

exports.getLatest = (req, res) => {
    Location.getLatest(req.params.vehicleId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(result[0] || {});
    });
};