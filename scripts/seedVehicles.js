require("dotenv").config();
const db = require("../src/config/db");

// Sri Lanka district → province mapping
const geoMap = {
    "Colombo": "Western",
    "Gampaha": "Western",
    "Kalutara": "Western",

    "Kurunegala": "North Western",
    "Puttalam": "North Western",

    "Kandy": "Central",
    "Matale": "Central",
    "Nuwara Eliya": "Central",

    "Galle": "Southern",
    "Matara": "Southern",
    "Hambantota": "Southern",

    "Jaffna": "Northern",
    "Kilinochchi": "Northern",

    "Trincomalee": "Eastern",
    "Batticaloa": "Eastern",
    "Ampara": "Eastern",

    "Anuradhapura": "North Central",
    "Polonnaruwa": "North Central",

    "Badulla": "Uva",
    "Monaragala": "Uva",

    "Kegalle": "Sabaragamuwa",
    "Ratnapura": "Sabaragamuwa"
};

// extract district list
const districts = Object.keys(geoMap);

// helpers
function randomDistrict() {
    return districts[Math.floor(Math.random() * districts.length)];
}

function randomPhone() {
    return `07${Math.floor(100000000 + Math.random() * 90000000)}`;
}

function randomDriverName(i) {
    return `Driver_${i}`;
}

async function seedVehicles() {
    console.log("Seeding vehicles started...");

    for (let i = 1; i <= 200; i++) {

        const district = randomDistrict();
        const province = geoMap[district];

        const vehicle = {
            reg: `TK-${1000 + i}`,
            driver: randomDriverName(i),
            phone: randomPhone(),
            district,
            province
        };

        const sql = `
            INSERT INTO vehicles 
            (registration_number, driver_name, phone, district, province)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            vehicle.reg,
            vehicle.driver,
            vehicle.phone,
            vehicle.district,
            vehicle.province
        ], (err) => {
            if (err) {
                console.error("Insert error:", err);
            }
        });
    }

    console.log("200 vehicles inserted successfully");
}

seedVehicles();