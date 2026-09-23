# POLAR-SAFE AI

### Antarctic Sea-Ice, Iceberg Trajectory & Navigation Decision Support System

---

## 1. Project Overview

**POLAR-SAFE AI** is a professional navigation decision-support dashboard engineered for polar research vessels navigating Antarctic waters. It provides bridge officers and polar science expeditions with real-time risk assessment, environmental condition simulation, interactive high-latitude Leaflet mapping, AI-assisted safe waypoint calculation, live hazard alerting, and MySQL persistence with offline fallback support.

> [!IMPORTANT]
> **Safety Notice:** POLAR-SAFE AI is a **decision-support and visualization system**, NOT an autonomous navigation system. It does not replace human watchstanding or bridge navigation procedures. All environmental data included by default is simulated for demonstration and research purposes.

---

## 2. Features

- 🧭 **Interactive High-Latitude Leaflet Mapping**: Polar-centered dark map with research vessels, tracked icebergs, risk zones, iceberg drift trajectory vectors, user-selected route, and AI-recommended safe route.
- ⚡ **Multi-Factor Risk Assessment Engine**: Transparent, rule-based risk calculation evaluating sea-ice concentration, iceberg proximity distance, and iceberg swarm density.
- 🎛 **Live Environmental Simulation Controls**: Real-time interactive sliders for sea-ice concentration (0–100%), nearest iceberg distance (1–100 km), and iceberg density (0–50) with immediate UI recalculation.
- 🤖 **AI Safe Corridor Waypoint Generator**: Automatically calculates and renders Route B (Green Recommended Route) avoiding high-risk iceberg concentration zones.
- 📊 **Route Comparison Engine**: Direct visual risk score comparison between direct rhumb-line route vs. AI safe bypass corridor with safety delta points readout.
- 🚨 **Dynamic Multi-Tier Hazard Alerting**: Real-time alert banner switching dynamically across `CRITICAL`, `HIGH`, `MODERATE`, and `SAFE` states with specific sub-cards for Iceberg, Sea-Ice, and Route conditions.
- ⚙ **Subsystem Diagnostics Grid**: Real-time telemetry monitoring of Backend API, MySQL Database, SAR tracking, AI analysis engine, and environmental data feeds.
- 💾 **MySQL Persistence with Seamless Fallback**: Full MySQL schema with seeded Antarctic data and automatic graceful degradation to client/in-memory fallback when offline.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Mapping**: Leaflet 1.9 & React-Leaflet
- **Styling**: Vanilla CSS (Antarctic Dark Command Dashboard Design System)
- **Icons**: Unicode & SVG high-contrast markers
- **Typography**: Google Fonts (Outfit & JetBrains Mono)

### Backend
- **Runtime**: Node.js
- **Server**: Express.js
- **Database Driver**: `mysql2` (Connection pool with parameterized queries)
- **Configuration**: `dotenv`
- **Security & Middleware**: `cors`, input validators, and centralized error handler

### Database
- **Engine**: MySQL 8.0+ / MariaDB
- **Database Name**: `polar_safe_ai`

---

## 4. Folder Structure

```
polar-safe-ai/
│
├── frontend/                          # React + Vite Frontend
│   ├── public/                        # Static public assets
│   ├── src/
│   │   ├── assets/                    # Styling assets
│   │   ├── components/                # Modular React UI components
│   │   │   ├── Header.jsx             # Title, subtitle, system status indicator
│   │   │   ├── DisclaimerBanner.jsx   # Operational safety notice
│   │   │   ├── NavigationPlanning.jsx # Start & Dest coordinate selector
│   │   │   ├── RiskDashboard.jsx      # 6 core risk metric cards
│   │   │   ├── EnvironmentalControls.jsx # 3 real-time condition sliders
│   │   │   ├── PolarMap.jsx           # High-latitude Leaflet map
│   │   │   ├── MapLegend.jsx          # Visual map legend
│   │   │   ├── NavigationStatus.jsx   # Desktop side panel
│   │   │   ├── RouteComparison.jsx    # Selected vs recommended route cards
│   │   │   ├── LiveHazardAlerts.jsx   # Dynamic hazard alert banners
│   │   │   ├── EnvironmentalMonitoring.jsx # Current sensor telemetry cards
│   │   │   ├── SystemStatus.jsx       # Subsystem health diagnostics grid
│   │   │   └── LoadingIndicator.jsx   # Async loading spinner
│   │   ├── services/
│   │   │   ├── api.js                 # REST API client with offline fallback
│   │   │   └── riskCalculator.js      # Client-side mirror risk calculation
│   │   ├── App.jsx                    # Root dashboard layout
│   │   ├── main.jsx                   # React DOM entry point
│   │   └── index.css                  # Polar dark theme CSS
│   ├── index.html                     # HTML5 shell
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite bundler config
│   └── .env                           # Frontend environment variables
│
├── backend/                           # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                      # MySQL connection pool
│   ├── controllers/
│   │   ├── environmentController.js   # Telemetry controller
│   │   ├── routeController.js         # Route analysis & persistence
│   │   ├── icebergController.js       # Iceberg tracking controller
│   │   └── systemController.js        # Health & subsystem status
│   ├── routes/
│   │   ├── environmentRoutes.js       # /api/environment routes
│   │   ├── routeRoutes.js             # /api/analyze-route & /api/routes
│   │   ├── icebergRoutes.js           # /api/icebergs routes
│   │   └── systemRoutes.js            # /api/health & /api/system/status
│   ├── services/
│   │   └── riskService.js             # Transparent rule-based risk model
│   ├── middleware/
│   │   ├── validator.js               # API input validation
│   │   └── errorHandler.js            # Central error handler
│   ├── server.js                      # Express server entry point
│   ├── package.json                   # Backend dependencies
│   ├── .env                           # Local environment config
│   └── .env.example                   # Template environment config
│
├── database/
│   └── schema.sql                     # Full MySQL schema & seed data
│
└── README.md                          # Comprehensive documentation
```

---

## 5. Prerequisites

Before running the application, ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or later ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or later (bundled with Node.js)
- **MySQL Server**: v8.0 or later ([Download MySQL](https://dev.mysql.com/downloads/installer/)) *(Optional: application will run in simulated standalone mode if MySQL is not running)*

---

## 6. MySQL Installation & Setup

1. Install MySQL Server on your operating system or start your local MySQL service (e.g., MySQL Workbench, XAMPP, or Docker).
2. Start the MySQL service:
   ```bash
   # Windows (via Services or cmd)
   net start MySQL80
   
   # Linux / macOS
   sudo systemctl start mysql
   ```

---

## 7. Database Creation & Schema Execution

Run the provided SQL script located in `database/schema.sql` to create the database and seed initial demo data:

### Option A: Using MySQL Command Line
```bash
mysql -u root -p < database/schema.sql
```

### Option B: Using MySQL Shell or Workbench
1. Open MySQL Workbench or MySQL Shell.
2. Open the file `database/schema.sql`.
3. Execute the entire script.

The script creates:
- `polar_safe_ai` database
- `environment_data` table
- `icebergs` table with simulated Weddell/Ross sea icebergs
- `route_analysis` table
- `system_status` table with initial subsystem statuses

---

## 8. Backend Installation

Navigate to the `backend/` directory and install the required npm dependencies:

```bash
cd backend
npm install
```

---

## 9. Frontend Installation

In a separate terminal, navigate to the `frontend/` directory and install the required npm dependencies:

```bash
cd frontend
npm install
```

---

## 10. Environment Variables

### Backend (`backend/.env`)
Create or edit `backend/.env` with your local configuration:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=polar_safe_ai
DB_PORT=3306
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
The frontend points to the Express backend API:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 11. How to Start the Backend Server

From the `backend` folder:

```bash
cd backend
npm run dev
```

The server will start on **http://localhost:5000**.
Output:
```
====================================================
🧊 POLAR-SAFE AI Backend Server Running on port 5000
🌐 API Base URL: http://localhost:5000/api
📡 Health Check: http://localhost:5000/api/health
====================================================
```

---

## 12. How to Start the Frontend Application

In a separate terminal window:

```bash
cd frontend
npm run dev
```

Open your web browser and navigate to **http://localhost:5173**.

---

## 13. API Endpoints Reference

| Method | Endpoint | Description | Sample Payload / Response |
|---|---|---|---|
| `GET` | `/api/health` | Service health & MySQL status | `{ "status": "online", "database": "connected" }` |
| `GET` | `/api/system/status` | Subsystem diagnostics | Array of subsystem health rows |
| `GET` | `/api/environment` | Fetch current telemetry | `{ "seaIceConcentration": 63, "nearestIcebergDistance": 24, ... }` |
| `POST` | `/api/environment` | Update simulated telemetry | `{ "seaIceConcentration": 70, "nearestIcebergDistance": 18 }` |
| `GET` | `/api/icebergs` | List tracked icebergs & drift paths | Array of iceberg objects with trajectory coordinates |
| `POST` | `/api/analyze-route` | Evaluate risk & compute safe waypoints | `{ "start": { "lat": -60.21, "lng": -45.16 }, "destination": { "lat": -60.56, "lng": 62.79 } }` |
| `GET` | `/api/routes` | History of analyzed routes | Array of past route analyses from MySQL |
| `POST` | `/api/routes` | Save analyzed route record | Saves analysis in `route_analysis` table |

---

## 14. How Map Interaction Works

1. **First Map Click**: Sets the **Start Location** (`📍 START LOCATION`). The latitude and longitude are recorded in the Navigation Planning panel.
2. **Second Map Click**: Sets the **Destination** (`🎯 DESTINATION`).
3. **Automatic Route Generation**:
   - 🔵 **Blue Dashed Line (`Selected Route`)**: Draws the direct linear heading between Start and Destination.
   - 🟢 **Green Dashed Line (`Recommended Route - Route B`)**: Automatically computes and renders a safe bypass waypoint arc that navigates around dense pack ice and tabular iceberg concentrations.
4. **Subsequent Clicks**: Reset the start point for quick re-planning.
5. **Interactive Popups**: Click any iceberg (🧊), research vessel (🚢), or risk zone to inspect telemetry, drift velocity, estimated draft, and warning levels.

---

## 15. How Risk Calculation Works

The system utilizes a transparent, rule-based polar navigation scoring model (0–100 score):

### 1. Sea-Ice Concentration Risk (0–50 points)
- `0% - 30%`: **5 points**
- `31% - 50%`: **15 points**
- `51% - 70%`: **25 points**
- `71% - 85%`: **40 points**
- `86% - 100%`: **50 points**

### 2. Nearest Iceberg Proximity Risk (5–50 points)
- `70+ km`: **5 points**
- `50 - 69 km`: **10 points**
- `30 - 49 km`: **20 points**
- `15 - 29 km`: **35 points**
- `< 15 km`: **50 points**

### 3. Iceberg Density Risk (5–40 points)
- `0 - 5`: **5 points**
- `6 - 15`: **10 points**
- `16 - 25`: **20 points**
- `26 - 40`: **30 points**
- `41 - 50`: **40 points**

### Overall Risk Score
$$\text{Risk Score} = \min(100, \text{SeaIceRisk} + \text{IcebergRisk} + \text{DensityRisk})$$

### Classification Thresholds:
| Score Range | Risk Level | Navigation Status | AI Decision | Recommendation |
|---|---|---|---|---|
| **81 – 100** | `CRITICAL` | `DANGER` | `AVOID HIGH-RISK AREA` | Review AI recommended route and avoid high-density iceberg regions. |
| **61 – 80** | `HIGH` | `CAUTION` | `PROCEED WITH CAUTION` | Review environmental conditions and maintain additional clearance. |
| **31 – 60** | `MODERATE` | `MONITOR` | `MONITOR CONDITIONS` | Continue monitoring sea ice and iceberg conditions. |
| **0 – 30** | `LOW` | `SAFE` | `LOWER CALCULATED RISK` | Continue monitoring environmental conditions. |

### Route Comparison Calculation:
- $\text{Selected Route Risk} = \text{clamp}(\text{BaseRisk} + 8, 0, 100)$
- $\text{Recommended Route Risk} = \text{clamp}(\text{BaseRisk} - 18, 0, 100)$
- $\text{Safety Delta} = \text{SelectedRouteRisk} - \text{RecommendedRouteRisk}$

---

## 16. How to Replace Demo Data with Real Environmental Data

To integrate operational polar feeds in place of simulated data:

1. **Sea-Ice Data**:
   - Connect to the **National Snow and Ice Data Center (NSIDC)** Sea Ice Index API or **Copernicus Marine Environment Monitoring Service (CMEMS)**.
   - Update `backend/controllers/environmentController.js` to query the external satellite raster or NetCDF/GeoJSON endpoints on a scheduled cron job.
2. **Iceberg Tracking Data**:
   - Connect to the **U.S. National Ice Center (USNIC)** Antarctic Iceberg Tracking database or **NIC SAR/Altimetry feeds**.
   - Parse iceberg CSV/GeoJSON feeds in `backend/controllers/icebergController.js` and update the `icebergs` table in MySQL.
3. **Vessel AIS Telemetry**:
   - Ingest live NMEA 0183 / NMEA 2000 AIS feeds over UDP/WebSockets into `PolarMap.jsx` to render real-time vessel coordinates, heading, and speed over ground (SOG).

---

## 17. System Limitations

- **Simulated Data**: By default, environmental feeds and iceberg locations are synthesized for demonstration and testing purposes.
- **Simplified Geodesics**: Navigational waypoint calculations use Mercator/equirectangular planar approximations suitable for visual decision support. Polar stereographic projection or great circle geodesic interpolation should be utilized for actual nautical navigation.
- **Static Hydrography**: Bathymetric depth constraints, shallow reefs, and submerged grounding hazards are not modeled in this tier.

---

## 18. Safety Disclaimer

> [!CAUTION]
> **LEGAL & MARITIME SAFETY DISCLAIMER**
> 
> POLAR-SAFE AI IS DESIGNED STRICTLY AS AN EXPERIMENTAL DECISION-SUPPORT AID AND VISUALIZATION INTERFACE. IT IS **NOT** AN AUTONOMOUS SHIP CONTROL SYSTEM, AUTOPILOT, OR PRIMARY ELECTRONIC CHART DISPLAY AND INFORMATION SYSTEM (ECDIS).
> 
> THE MASTER AND BRIDGE WATCHKEEPERS MAINTAIN FULL, SOLE RESPONSIBILITY FOR SAFE SHIP OPERATION, COMPLIANCE WITH COLREGS (INTERNATIONAL REGULATIONS FOR PREVENTING COLLISIONS AT SEA), AND THE POLAR CODE. NO MARITIME WARRANTY OF NAVIGATIONAL SAFETY IS EXPRESSED OR IMPLIED.

---

## 19. Quick Start Commands Summary

### Terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

### MySQL Initialization:
```bash
mysql -u root -p < database/schema.sql
```
