const db = require("../config/db");

const Vehicle = {
    create: (vehicle, callback) => {
        const sql = `
            INSERT INTO vehicles 
            (registration_number, driver_name, phone, district)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            vehicle.registration_number,
            vehicle.driver_name,
            vehicle.phone,
            vehicle.district
        ], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM vehicles`;
        db.query(sql, callback);
    },

    getByDistrict: (district, callback) => {
        const sql = "SELECT * FROM vehicles WHERE district = ?";
        db.query(sql, [district], callback);
    },

    getByProvince: (province, callback) => {
        const sql = "SELECT * FROM vehicles WHERE province = ?";
        db.query(sql, [province], callback);
    },

    getWithLatestLocation: (callback) => {
        const sql = `
            SELECT v.*, l.latitude, l.longitude, l.speed, l.recorded_at
            FROM vehicles v
            LEFT JOIN (
                SELECT *
                FROM locations l1
                WHERE l1.recorded_at = (
                    SELECT MAX(l2.recorded_at)
                    FROM locations l2
                    WHERE l2.vehicle_id = l1.vehicle_id
                )
            ) l ON v.id = l.vehicle_id
        `;

        db.query(sql, callback);
    },

    getByDistrictWithLocation: (district, callback) => {
        const sql = `
            SELECT v.*, l.latitude, l.longitude, l.speed, l.recorded_at
            FROM vehicles v
            LEFT JOIN (
                SELECT *
                FROM locations l1
                WHERE l1.recorded_at = (
                    SELECT MAX(l2.recorded_at)
                    FROM locations l2
                    WHERE l2.vehicle_id = l1.vehicle_id
                )
            ) l ON v.id = l.vehicle_id
            WHERE v.district = ?
        `;

        db.query(sql, [district], callback);
    }


};

module.exports = Vehicle;