const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.register = (req, res) => {
    const { username, password, role } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    User.create(
        {
            username,
            password: hashedPassword,
            role
        },
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            res.status(201).json({
                message: "User registered successfully"
            });
        }
    );
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];

        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });
    });
};