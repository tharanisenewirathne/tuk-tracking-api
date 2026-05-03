require("dotenv").config();
const db = require("../src/config/db");

//Sri Lanka geo mapping
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

const districts = Object.keys(geoMap);
const provinces = [...new Set(Object.values(geoMap))];

// ------------------- HELPERS -------------------

const randomPhone = () =>
    `07${Math.floor(100000000 + Math.random() * 90000000)}`;

const randomDriver = (i) => `Driver_${i}`;

// ------------------- SEED FUNCTIONS -------------------

async function seedProvinces() {
    console.log("Seeding provinces...");

    for (let p of provinces) {
        await db.promise().query(
            "INSERT INTO provinces (name) VALUES (?)",
            [p]
        );
    }

    console.log("Provinces seeded");
}

async function seedDistricts() {
    console.log("Seeding districts...");

    for (let d of districts) {
        const province = geoMap[d];

        await db.promise().query(
            "INSERT INTO districts (name, province_id) VALUES (?, ?)",
            [d, null] // simplified model
        );
    }

    console.log("✔ Districts seeded");
}

async function seedPoliceStations() {
    console.log("Seeding police stations...");

    //HQ
    await db.promise().query(
        "INSERT INTO police_stations (name, type) VALUES (?, ?)",
        ["Sri Lanka Police HQ", "HQ"]
    );

    //Provincial HQs
    for (let p of provinces) {
        await db.promise().query(
            "INSERT INTO police_stations (name, type, province)",
            `VALUES (?, 'PROVINCE', ?)`,
            [`${p} Provincial HQ`, p]
        );
    }

    //District HQs + Stations
    for (let d of districts) {
        const province = geoMap[d];

        // District HQ
        await db.promise().query(
            `INSERT INTO police_stations (name, type, province, district)
             VALUES (?, 'DISTRICT', ?, ?)`,
            [`${d} Police HQ`, province, d]
        );

        // Optional multiple stations per district (simulation)
        for (let i = 1; i <= 3; i++) {
            await db.promise().query(
                `INSERT INTO police_stations (name, type, province, district)
                 VALUES (?, 'STATION', ?, ?)`,
                [`${d} Station ${i}`, province, d]
            );
        }
    }

    console.log("Police stations seeded");
}

async function seedVehicles() {
    console.log("Seeding vehicles...");

    for (let i = 1; i <= 200; i++) {
        const district = districts[Math.floor(Math.random() * districts.length)];
        const province = geoMap[district];

        await db.promise().query(
            `INSERT INTO vehicles 
            (registration_number, driver_name, phone, district, province)
            VALUES (?, ?, ?, ?, ?)`,
            [
                `TK-${1000 + i}`,
                randomDriver(i),
                randomPhone(),
                district,
                province
            ]
        );
    }

    console.log("Vehicles seeded");
}

// ------------------- RUN ALL -------------------

async function seedAll() {
    try {
        console.log("SEEDING STARTED");

        await seedProvinces();
        await seedDistricts();
        await seedPoliceStations();
        await seedVehicles();

        console.log("ALL DATA SEEDED SUCCESSFULLY");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seedAll();