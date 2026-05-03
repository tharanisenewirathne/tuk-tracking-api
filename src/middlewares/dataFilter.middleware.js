const filterByRole = (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized user" });
    }

    // Base scope object
    req.accessScope = {
        province: null,
        district: null
    };

    // HQ ADMIN → no restrictions
    if (user.role === "HQ_ADMIN") {
        return next();
    }

    // PROVINCIAL OFFICER → locked to province
    if (user.role === "PROVINCIAL_OFFICER") {
        if (!user.province) {
            return res.status(400).json({ message: "Province not assigned to user" });
        }

        req.accessScope.province = user.province;
        return next();
    }

    // DISTRICT OFFICER → locked to district (and implicitly province)
    if (user.role === "DISTRICT_OFFICER") {
        if (!user.district) {
            return res.status(400).json({ message: "District not assigned to user" });
        }

        req.accessScope.district = user.district;
        return next();
    }

    return res.status(403).json({ message: "Access denied" });
};

module.exports = filterByRole;