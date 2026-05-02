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