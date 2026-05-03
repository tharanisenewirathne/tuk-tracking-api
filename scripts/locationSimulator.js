require("dotenv").config();
const db = require("../src/config/db");

function randomLatLon() {
    // Sri Lanka bounds
    const lat = 5.9 + Math.random() * 3.2;
    const lon = 79.7 + Math.random() * 2.5;
    return { lat, lon };
}

function randomSpeed() {
    return Math.floor(Math.random() * 60);
}

async function simulate() {
    try {
        const [vehicles] = await db.promise().query(
            "SELECT id FROM vehicles"
        );

        for (const v of vehicles) {
            const { lat, lon } = randomLatLon();

            await db.promise().query(
                `INSERT INTO locations 
                (vehicle_id, latitude, longitude, speed)
                VALUES (?, ?, ?, ?)`,
                [v.id, lat, lon, randomSpeed()]
            );
        }

        console.log("✔ GPS batch inserted:", vehicles.length);

    } catch (err) {
        console.error("GPS simulation error:", err);
    }
}

// run every 10 seconds
setInterval(simulate, 10000);

// initial run
simulate();