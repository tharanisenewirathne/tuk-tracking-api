const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.register = (req, res) => {
    const { username, password, role, province, district } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    User.create(
        {
            username,
            password: hashedPassword,
            role,
            province,
            district
        },
        (err) => {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                message: "User registered successfully"
            });
        }
    );
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    // validation
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    User.findByUsername(username, (err, results) => {
        if (err) {
            console.error(err);
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

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                province: user.province || null,
                district: user.district || null
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });
    });
};