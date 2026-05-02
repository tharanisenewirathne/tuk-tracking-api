const db = require("../config/db");

const Geography = {

    getProvinces: (callback) => {
        db.query("SELECT * FROM provinces", callback);
    },

    getDistrictsByProvince: (provinceId, callback) => {
        db.query(
            "SELECT * FROM districts WHERE province_id = ?",
            [provinceId],
            callback
        );
    },

    getStationsByDistrict: (districtId, callback) => {
        db.query(
            "SELECT * FROM police_stations WHERE district_id = ?",
            [districtId],
            callback
        );
    }
};

module.exports = Geography;