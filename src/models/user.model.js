const db = require("../config/db");

const User = {
    create: (user, callback) => {
        const sql = `
            INSERT INTO users 
            (username, password, role, province, district, police_station_name)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            user.username,
            user.password,
            user.role,
            user.province,
            user.district,
            user.police_station_name
        ], callback);
    },

    findByUsername: (username, callback) => {
        const sql = `SELECT * FROM users WHERE username = ?`;
        db.query(sql, [username], callback);
    }
};

module.exports = User;