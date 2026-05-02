const db = require("../config/db");

const Vehicle = {
    create: (vehicle, callback) => {
        const sql = `
            INSERT INTO vehicles 
            (registration_number, driver_name, phone, district, province)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            vehicle.registration_number,
            vehicle.driver_name,
            vehicle.phone,
            vehicle.district,
            vehicle.province
        ], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM vehicles`;
        db.query(sql, callback);
    }
};

module.exports = Vehicle;