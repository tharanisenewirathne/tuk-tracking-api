const db = require("../config/db");
const Vehicle = require("../models/vehicle.model");

const provinceDistrictMap = {
    "Western": ["Colombo", "Gampaha", "Kalutara"],
    "Southern": ["Galle", "Matara", "Hambantota"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "Eastern": ["Trincomalee", "Batticaloa", "Ampara"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Monaragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle"]
};

exports.createVehicle = (req, res) => {
    Vehicle.create(req.body, (err, result) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({
                error: err.sqlMessage || err
            });
        }

        res.status(201).json({
            message: "Vehicle registered successfully",
            vehicle_id: result.insertId,
            registration_number: req.body.registration_number
        });
    });
};

exports.getAllVehicles = (req, res) => {

    const scope = req.accessScope;
    const { province, district } = req.query;

    let sql = "SELECT * FROM vehicles";
    let conditions = [];
    let params = [];

    // ======================================================
    // 1. HQ ADMIN 
    // ======================================================
    if (!scope?.province && !scope?.district) {
        // HQ_ADMIN path
        if (province) {
            conditions.push("province = ?");
            params.push(province);
        }

        if (district) {
            conditions.push("district = ?");
            params.push(district);
        }
    }

    // ======================================================
    // 2. PROVINCIAL OFFICER
    // ======================================================
    else if (scope?.province) {

        //block wrong province
        if (province && province !== scope.province) {
            return res.status(403).json({
                message: `Access denied. You are restricted to ${scope.province} province.`
            });
        }

        //validate district belongs to province
        if (district) {
            const allowedDistricts = provinceDistrictMap[scope.province];

            if (!allowedDistricts.includes(district)) {
                return res.status(403).json({
                    message: `Access denied. District ${district} does not belong to ${scope.province} province.`
                });
            }

            conditions.push("district = ?");
            params.push(district);
        }

        conditions.push("province = ?");
        params.push(scope.province);
    }

    // ======================================================
    // 3. DISTRICT OFFICER
    // ======================================================
    else if (scope?.district) {

        //block any district override
        if (district && district !== scope.district) {
            return res.status(403).json({
                message: `Access denied. You are only allowed to access ${scope.district} district.`
            });
        }

        //block province filtering attempt
        if (province) {
            return res.status(403).json({
                message: `Access denied. District officers cannot filter by province.`
            });
        }

        conditions.push("district = ?");
        params.push(scope.district);
    }

    // ======================================================
    // 4. BUILD SQL QUERY
    // ======================================================
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    console.log("SQL:", sql);
    console.log("PARAMS:", params);

    // ======================================================
    // 5. EXECUTE QUERY
    // ======================================================
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json(err);
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

    const scope = req.accessScope;
    const { province, district } = req.query;

    let sql = `
        SELECT v.*, l.latitude, l.longitude, l.recorded_at
        FROM vehicles v
        JOIN locations l ON v.id = l.vehicle_id
        WHERE l.id IN (
            SELECT MAX(id)
            FROM locations
            GROUP BY vehicle_id
        )
    `;

    let conditions = [];
    let params = [];

    // ======================================================
    // 1. DISTRICT OFFICER (STRICTEST RULE)
    // ======================================================
    if (scope?.district) {

        //BLOCK ANY OTHER DISTRICT
        if (district && district !== scope.district) {
            return res.status(403).json({
                message: `Access denied. You are only allowed to access ${scope.district} district.`
            });
        }

        //BLOCK PROVINCE FILTER COMPLETELY
        if (province) {
            return res.status(403).json({
                message: "District officers cannot filter by province."
            });
        }

        // FORCE DISTRICT ONLY
        conditions.push("v.district = ?");
        params.push(scope.district);
    }

    // ======================================================
    // 2. PROVINCIAL OFFICER
    // ======================================================
    else if (scope?.province) {

        //BLOCK OTHER PROVINCES
        if (province && province !== scope.province) {
            return res.status(403).json({
                message: `Access denied. You are restricted to ${scope.province} province.`
            });
        }

        //BLOCK DISTRICTS OUTSIDE PROVINCE
        if (district) {
            conditions.push("v.district = ?");
            params.push(district);
        }

        // FORCE PROVINCE SCOPE ALWAYS
        conditions.push("v.province = ?");
        params.push(scope.province);
    }

    // ======================================================
    // 3. HQ ADMIN (NO RESTRICTIONS)
    // ======================================================
    else {

        if (province) {
            conditions.push("v.province = ?");
            params.push(province);
        }

        if (district) {
            conditions.push("v.district = ?");
            params.push(district);
        }
    }

    // ======================================================
    // 4. APPLY CONDITIONS
    // ======================================================
    if (conditions.length > 0) {
        sql += " AND " + conditions.join(" AND ");
    }

    console.log("SQL:", sql);
    console.log("PARAMS:", params);
    console.log("SCOPE:", scope);

    db.query(sql, params, (err, results) => {
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