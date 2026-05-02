const filterByRole = (req, res, next) => {
    const user = req.user;

    if (user.role === "HQ_ADMIN") {
        return next(); // full access
    }

    if (user.role === "PROVINCIAL_OFFICER") {
        req.filter = { province: user.province };
        return next();
    }

    if (user.role === "DISTRICT_OFFICER") {
        req.filter = { district: user.district };
        return next();
    }

    return res.status(403).json({ message: "Access denied" });
};

module.exports = filterByRole;