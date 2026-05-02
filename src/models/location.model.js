const db = require("../config/db");

const Location = {
    create: (data, callback) => {
        const sql = `
            INSERT INTO locations 
            (vehicle_id, latitude, longitude, speed)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [
            data.vehicle_id,
            data.latitude,
            data.longitude,
            data.speed
        ], callback);
    },

    getByVehicle: (vehicleId, callback) => {
        const sql = `
            SELECT * FROM locations 
            WHERE vehicle_id = ?
            ORDER BY recorded_at DESC
        `;

        db.query(sql, [vehicleId], callback);
    },

    getLatest: (vehicleId, callback) => {
        const sql = `
            SELECT * FROM locations 
            WHERE vehicle_id = ?
            ORDER BY recorded_at DESC 
            LIMIT 1
        `;

        db.query(sql, [vehicleId], callback);
    }
};

module.exports = Location;