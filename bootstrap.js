// Automatic database setup.
// Runs once when the server starts:
//   1. creates the tables from database/schema.sql (if they don't exist yet)
//   2. loads the sample data (provinces, districts, police stations, 200 vehicles)
//      only if the database is empty
//   3. adds some sample GPS history only if there is none yet
// Running it again does not create duplicates.
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const geoMap = {
    "Colombo": "Western", "Gampaha": "Western", "Kalutara": "Western",
    "Kurunegala": "North Western", "Puttalam": "North Western",
    "Kandy": "Central", "Matale": "Central", "Nuwara Eliya": "Central",
    "Galle": "Southern", "Matara": "Southern", "Hambantota": "Southern",
    "Jaffna": "Northern", "Kilinochchi": "Northern",
    "Trincomalee": "Eastern", "Batticaloa": "Eastern", "Ampara": "Eastern",
    "Anuradhapura": "North Central", "Polonnaruwa": "North Central",
    "Badulla": "Uva", "Monaragala": "Uva",
    "Kegalle": "Sabaragamuwa", "Ratnapura": "Sabaragamuwa"
};

async function seedReferenceData(conn) {
    const districts = Object.keys(geoMap);
    const provinces = [...new Set(Object.values(geoMap))];

    await conn.query("INSERT INTO provinces (name) VALUES ?", [provinces.map((p) => [p])]);
    await conn.query("INSERT INTO districts (name, province_id) VALUES ?", [districts.map((d) => [d, null])]);

    const stations = [["Sri Lanka Police HQ", "HQ", null, null]];
    provinces.forEach((p) => stations.push([`${p} Provincial HQ`, "PROVINCE", p, null]));
    districts.forEach((d) => {
        stations.push([`${d} Police HQ`, "DISTRICT", geoMap[d], d]);
        for (let i = 1; i <= 3; i++) stations.push([`${d} Station ${i}`, "STATION", geoMap[d], d]);
    });
    await conn.query("INSERT INTO police_stations (name, type, province, district) VALUES ?", [stations]);

    const vehicles = [];
    for (let i = 1; i <= 200; i++) {
        const district = districts[Math.floor(Math.random() * districts.length)];
        vehicles.push([
            `TK-${1000 + i}`,
            `Driver_${i}`,
            `07${Math.floor(100000000 + Math.random() * 90000000)}`,
            district,
            geoMap[district]
        ]);
    }
    await conn.query(
        "INSERT INTO vehicles (registration_number, driver_name, phone, district, province) VALUES ?",
        [vehicles]
    );
    console.log("Sample data loaded (provinces, districts, stations, 200 vehicles)");
}

async function seedLocationHistory(conn) {
    const [vehicles] = await conn.query("SELECT id FROM vehicles");
    const rows = [];
    // 6 pings per vehicle over the last 6 hours, inside Sri Lanka's bounding box
    for (const v of vehicles) {
        for (let h = 6; h >= 1; h--) {
            rows.push([
                v.id,
                5.9 + Math.random() * 3.2,
                79.7 + Math.random() * 2.5,
                Math.floor(Math.random() * 60),
                new Date(Date.now() - h * 60 * 60 * 1000)
            ]);
        }
    }
    if (rows.length > 0) {
        await conn.query(
            "INSERT INTO locations (vehicle_id, latitude, longitude, speed, recorded_at) VALUES ?",
            [rows]
        );
    }
    console.log(`Sample GPS history loaded (${rows.length} pings)`);
}

async function bootstrap() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        multipleStatements: true,
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined
    });

    try {
        const schema = fs.readFileSync(path.join(__dirname, "..", "..", "database", "schema.sql"), "utf8");
        await conn.query(schema);

        const [[{ provinceCount }]] = await conn.query("SELECT COUNT(*) AS provinceCount FROM provinces");
        if (provinceCount === 0) {
            await seedReferenceData(conn);
        }

        const [[{ locationCount }]] = await conn.query("SELECT COUNT(*) AS locationCount FROM locations");
        if (locationCount === 0) {
            await seedLocationHistory(conn);
        }

        console.log("Database ready");
    } finally {
        await conn.end();
    }
}

module.exports = bootstrap;
