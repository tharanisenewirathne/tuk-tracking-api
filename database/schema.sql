-- Tuk-Tuk Tracking API - database schema
-- Rebuilt from the queries used in src/models, src/controllers and scripts/seedVehicles.js.
-- Safe to run more than once (uses IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS provinces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    province_id INT NULL,
    CONSTRAINT fk_districts_province FOREIGN KEY (province_id) REFERENCES provinces(id)
);

CREATE TABLE IF NOT EXISTS police_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type ENUM('HQ', 'PROVINCE', 'DISTRICT', 'STATION') NOT NULL,
    province VARCHAR(50) NULL,
    district VARCHAR(50) NULL,
    district_id INT NULL,
    CONSTRAINT fk_stations_district FOREIGN KEY (district_id) REFERENCES districts(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    province VARCHAR(50) NULL,
    district VARCHAR(50) NULL,
    police_station_name VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    driver_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    district VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vehicles_district (district),
    INDEX idx_vehicles_province (province)
);

CREATE TABLE IF NOT EXISTS locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed INT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_locations_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    INDEX idx_locations_vehicle_time (vehicle_id, recorded_at)
);
