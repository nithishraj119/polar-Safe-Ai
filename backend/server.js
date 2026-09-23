const express = require("express");
const cors = require("cors");

const routeRoutes = require("./routes/routeRoutes");
const environmentRoutes = require("./routes/environmentRoutes");
const fleetRoutes = require("./routes/fleetRoutes");
const icebergRoutes = require("./routes/icebergRoutes");
const systemRoutes = require("./routes/systemRoutes");

const app = express();

const PORT = 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Polar-Safe AI Backend is running",
    version: "1.0.0"
  });
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "Polar-Safe AI",
    status: "healthy"
  });
});

// ==========================================
// ROUTES
// ==========================================

app.use("/api/routes", routeRoutes);
app.use("/api/environment", environmentRoutes);
app.use("/api/fleet", fleetRoutes);
app.use("/api/icebergs", icebergRoutes);
app.use("/api/system", systemRoutes);

// ==========================================
// RISK ANALYSIS
// ==========================================

app.post("/api/risk-analysis", (req, res) => {

  const {
    temperature,
    windSpeed,
    visibility,
    iceThickness
  } = req.body;

  let riskScore = 0;

  // Temperature
  if (typeof temperature === "number") {
    if (temperature < -40) {
      riskScore += 35;
    } else if (temperature < -20) {
      riskScore += 20;
    } else if (temperature < -10) {
      riskScore += 10;
    }
  }

  // Wind
  if (typeof windSpeed === "number") {
    if (windSpeed > 80) {
      riskScore += 30;
    } else if (windSpeed > 50) {
      riskScore += 20;
    } else if (windSpeed > 30) {
      riskScore += 10;
    }
  }

  // Visibility
  if (typeof visibility === "number") {
    if (visibility < 500) {
      riskScore += 25;
    } else if (visibility < 1000) {
      riskScore += 15;
    } else if (visibility < 3000) {
      riskScore += 5;
    }
  }

  // Ice thickness
  if (typeof iceThickness === "number") {
    if (iceThickness < 0.5) {
      riskScore += 30;
    } else if (iceThickness < 1) {
      riskScore += 15;
    }
  }

  // Maximum score
  riskScore = Math.min(riskScore, 100);

  let riskLevel;

  if (riskScore >= 70) {
    riskLevel = "HIGH";
  } else if (riskScore >= 40) {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "LOW";
  }

  let recommendation;

  if (riskLevel === "HIGH") {
    recommendation =
      "High risk detected. Route requires careful evaluation.";
  } else if (riskLevel === "MEDIUM") {
    recommendation =
      "Moderate risk detected. Additional monitoring is recommended.";
  } else {
    recommendation =
      "Low risk detected. Conditions are relatively favorable.";
  }

  res.json({
    success: true,
    riskScore,
    riskLevel,
    recommendation
  });
});

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

  console.log("");
  console.log("==========================================");
  console.log("        POLAR-SAFE AI BACKEND");
  console.log("==========================================");
  console.log(`Server:      http://localhost:${PORT}`);
  console.log(`Health:      http://localhost:${PORT}/api/health`);
  console.log(`Routes:      http://localhost:${PORT}/api/routes`);
  console.log(`Risk API:    http://localhost:${PORT}/api/risk-analysis`);
  console.log("==========================================");
  console.log("");
});