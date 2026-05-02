require("dotenv").config();
const db = require("../src/config/db");

function randomLatLon() {
    // Sri Lanka approximate bounds
    const lat = 6 + Math.random() * 3;
    const lon = 79 + Math.random() * 3;
    return { lat, lon };
}

function randomSpeed() {
    return Math.floor(Math.random() * 60);
}

function simulate() {
    db.query("SELECT id FROM vehicles", (err, vehicles) => {
        if (err) return console.error(err);

        vehicles.forEach(v => {
            const { lat, lon } = randomLatLon();

            db.query(
                `INSERT INTO locations (vehicle_id, latitude, longitude, speed)
                 VALUES (?, ?, ?, ?)`,
                [v.id, lat, lon, randomSpeed()]
            );
        });

        console.log("Batch GPS update inserted");
    });
}

// run every 10 seconds (simulation)
setInterval(simulate, 10000);

simulate();