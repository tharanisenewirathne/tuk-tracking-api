const Location = require("../models/location.model");
const db = require("../config/db");

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

    const scope = req.accessScope;
    const vehicleId = req.params.vehicleId;
    const { startDate, endDate } = req.query;

    // ======================================================
    // 1. CHECK VEHICLE OWNERSHIP
    // ======================================================
    const checkSql = `
        SELECT id, province, district
        FROM vehicles
        WHERE id = ?
    `;

    db.query(checkSql, [vehicleId], (err, vehicleResult) => {

        if (err) return res.status(500).json(err);

        if (vehicleResult.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        const vehicle = vehicleResult[0];

        // ==================================================
        // 2. ACCESS VALIDATION
        // ==================================================

        //DISTRICT OFFICER CHECK
        if (scope?.district) {
            if (vehicle.district !== scope.district) {
                return res.status(403).json({
                    message: "Access denied. Vehicle does not belong to your district."
                });
            }
        }

        //PROVINCIAL OFFICER CHECK
        if (scope?.province && !scope?.district) {
            if (vehicle.province !== scope.province) {
                return res.status(403).json({
                    message: "Access denied. Vehicle does not belong to your province."
                });
            }
        }

        // ======================================================
        // 3. GET HISTORY
        // ======================================================

        let sql = `
            SELECT *
            FROM locations
            WHERE vehicle_id = ?
        `;

        let params = [vehicleId];

        // default last 7 days
        let end = endDate ? new Date(endDate) : new Date();
        let start = startDate
            ? new Date(startDate)
            : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const diffDays = (end - start) / (1000 * 60 * 60 * 24);

        if (diffDays > 7) {
            return res.status(400).json({
                message: "Date range cannot exceed 7 days"
            });
        }

        sql += " AND recorded_at BETWEEN ? AND ?";
        params.push(start, end);

        db.query(sql, params, (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
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