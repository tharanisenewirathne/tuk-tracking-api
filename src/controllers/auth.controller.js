const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const db = require("../config/db");

/**
 * REGISTER USER WITH ROLE-BASED POLICE STATION ASSIGNMENT
 */
exports.register = async (req, res) => {
    const { username, password, role, province, district } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        let police_station_name = null;

        // 🟥 HQ ADMIN
        if (role === "HQ_ADMIN") {
            const [rows] = await db.promise().query(
                "SELECT name FROM police_stations WHERE type='HQ' LIMIT 1"
            );

            if (rows.length === 0) {
                return res.status(500).json({ message: "HQ not configured" });
            }

            police_station_name = rows[0].name;
        }

        // 🟧 PROVINCE OFFICER
        else if (role === "PROVINCE_OFFICER") {
            const [rows] = await db.promise().query(
                "SELECT name FROM police_stations WHERE type='PROVINCE' AND province=? LIMIT 1",
                [province]
            );

            if (rows.length === 0) {
                return res.status(400).json({ message: "Province HQ not found" });
            }

            police_station_name = rows[0].name;
        }

        // 🟨 DISTRICT OFFICER
        else if (role === "DISTRICT_OFFICER") {
            const [rows] = await db.promise().query(
                "SELECT name FROM police_stations WHERE type='DISTRICT' AND district=? LIMIT 1",
                [district]
            );

            if (rows.length === 0) {
                return res.status(400).json({ message: "District HQ not found" });
            }

            police_station_name = rows[0].name;
        }

        // create user
        User.create(
            {
                username,
                password: hashedPassword,
                role,
                province,
                district,
                police_station_name
            },
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Database error" });
                }

                res.status(201).json({
                    message: "User registered successfully",
                    role,
                    police_station_name
                });
            }
        );

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


/**
 * LOGIN USER
 */
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    User.findByUsername(username, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];

        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 🔥 ROLE + LOCATION IS ALREADY STORED IN DB
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                province: user.province,
                district: user.district,
                police_station_name: user.police_station_name
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 🔥 CLEAN RESPONSE (NO INPUT REQUIRED FOR STATION)
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                province: user.province,
                district: user.district,
                police_station_name: user.police_station_name
            }
        });
    });
};