-- ============================================================================
-- POLAR-SAFE AI: Antarctic Sea-Ice, Iceberg Trajectory & Navigation Decision Support System
-- Database Initialization & Schema Definition
-- ============================================================================

CREATE DATABASE IF NOT EXISTS polar_safe_ai;
USE polar_safe_ai;

-- 1. Environmental Telemetry Data Table
CREATE TABLE IF NOT EXISTS environment_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sea_ice_concentration INT NOT NULL CHECK (sea_ice_concentration BETWEEN 0 AND 100),
    nearest_iceberg_distance INT NOT NULL CHECK (nearest_iceberg_distance >= 0),
    iceberg_density INT NOT NULL CHECK (iceberg_density BETWEEN 0 AND 100),
    wind_speed_knots DECIMAL(5, 2) DEFAULT 18.5,
    sea_surface_temp_c DECIMAL(4, 2) DEFAULT -1.8,
    visibility_km DECIMAL(5, 2) DEFAULT 8.2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Iceberg Tracking & Trajectory Table
CREATE TABLE IF NOT EXISTS icebergs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    trajectory_direction VARCHAR(50) NOT NULL,
    size_km2 DECIMAL(8, 2) DEFAULT 12.5,
    drift_speed_knots DECIMAL(4, 2) DEFAULT 1.2,
    estimated_draft_meters INT DEFAULT 220,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Route Analysis History Table
CREATE TABLE IF NOT EXISTS route_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_latitude DECIMAL(10, 6) NOT NULL,
    start_longitude DECIMAL(10, 6) NOT NULL,
    destination_latitude DECIMAL(10, 6) NOT NULL,
    destination_longitude DECIMAL(10, 6) NOT NULL,
    start_name VARCHAR(100) DEFAULT 'Research Station Alpha',
    destination_name VARCHAR(100) DEFAULT 'Target Observation Point',
    risk_score INT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    risk_level VARCHAR(50) NOT NULL,
    navigation_status VARCHAR(50) NOT NULL,
    selected_route_risk INT NOT NULL,
    recommended_route_risk INT NOT NULL,
    decision VARCHAR(255) NOT NULL,
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Subsystem Status Table
CREATE TABLE IF NOT EXISTS system_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    system_name VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DEMO DATA
-- ============================================================================

-- Seed initial environmental condition
INSERT INTO environment_data (sea_ice_concentration, nearest_iceberg_distance, iceberg_density, wind_speed_knots, sea_surface_temp_c, visibility_km)
VALUES (63, 24, 17, 22.4, -2.1, 6.5);

-- Seed simulated Antarctic icebergs (Weddell Sea & Southern Ocean approaches)
INSERT INTO icebergs (name, latitude, longitude, risk_level, trajectory_direction, size_km2, drift_speed_knots, estimated_draft_meters) VALUES
('Iceberg A-68A (Detached)', -61.5000, -40.2000, 'CRITICAL', 'North-Northeast (025°)', 420.00, 2.1, 280),
('Iceberg B-15K (Tabular)', -63.8000, -52.4000, 'HIGH', 'North-Northwest (340°)', 185.50, 1.4, 210),
('Iceberg C-28B (Pinnacle)', -65.2000, 15.6000, 'MODERATE', 'East-Southeast (110°)', 45.00, 0.8, 160),
('Iceberg D-09 (Weathered)', -62.1000, 48.3000, 'HIGH', 'Northeast (045°)', 92.30, 1.6, 195),
('Iceberg E-14 (Calved)', -64.4500, 60.1000, 'CRITICAL', 'Northwest (315°)', 310.00, 1.9, 250),
('Iceberg F-03 (Bergy Bit Cluster)', -59.8000, -25.0000, 'MODERATE', 'East (090°)', 15.20, 0.6, 90);

-- Seed initial system subsystem statuses
INSERT INTO system_status (system_name, status, description) VALUES
('System Status', 'ONLINE', 'Core Polar-Safe orchestration online'),
('Environmental Data', 'LIVE', 'Telemetry feed active (simulated feed)'),
('Iceberg Tracking', 'ACTIVE', 'Synthetic Aperture Radar & optical tracker active'),
('AI Route Analysis', 'ACTIVE', 'Multi-factor risk evaluation engine ready'),
('Database', 'CONNECTED', 'MySQL persistent store active'),
('Backend API', 'ONLINE', 'Express REST API server operational')
ON DUPLICATE KEY UPDATE status=VALUES(status), description=VALUES(description);

-- Seed initial route analysis
INSERT INTO route_analysis (
    start_latitude, start_longitude, destination_latitude, destination_longitude,
    start_name, destination_name, risk_score, risk_level, navigation_status,
    selected_route_risk, recommended_route_risk, decision, recommendation
) VALUES (
    -60.2168, -45.1617, -60.5642, 62.7921,
    'South Orkney Research Base', 'Mawson Coastal Sector',
    80, 'HIGH', 'CAUTION',
    88, 62, 'AVOID HIGH-RISK AREA',
    'Review AI recommended route (Route B) and avoid high-density iceberg zones along northern Weddell drift.'
);
