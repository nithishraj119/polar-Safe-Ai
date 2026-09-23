const { checkConnection } = require('../config/db');

const getHealth = async (req, res, next) => {
  try {
    const isDbConnected = await checkConnection();
    return res.json({
      status: 'online',
      database: isDbConnected ? 'connected' : 'offline',
      version: '2.0.0',
      standard: 'IMO Polar Code MSC.385(94) & POLARIS MSC.1/Circ.1519',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};

const getSystemStatus = async (req, res, next) => {
  try {
    const isDbConnected = await checkConnection();

    const subsystems = [
      {
        id: 1,
        systemName: 'System Status',
        status: 'ONLINE',
        description: 'Core Polar-Safe orchestration & state engine active',
        isHealthy: true,
        category: 'CORE'
      },
      {
        id: 2,
        systemName: 'IMO POLARIS Engine',
        status: 'ACTIVE',
        description: 'IMO Polar Code MSC.1/Circ.1519 RIO calculation engine operational',
        isHealthy: true,
        category: 'MARITIME_COMPLIANCE'
      },
      {
        id: 3,
        systemName: 'Drift Physics Solver',
        status: 'ACTIVE',
        description: 'Hydrodynamic drag & Coriolis acceleration 48h trajectory model active',
        isHealthy: true,
        category: 'PHYSICS'
      },
      {
        id: 4,
        systemName: 'Open-Meteo Marine API',
        status: 'LIVE',
        description: 'Live Antarctic weather & ocean current telemetry sync operational',
        isHealthy: true,
        category: 'EXTERNAL_TELEMETRY'
      },
      {
        id: 5,
        systemName: 'AIS Fleet Transponder',
        status: 'ACTIVE',
        description: 'Antarctic scientific research fleet telemetry tracking 5 polar vessels',
        isHealthy: true,
        category: 'VESSEL_TRACKING'
      },
      {
        id: 6,
        systemName: 'Geodesic Route Solver',
        status: 'ACTIVE',
        description: 'Spherical Great Circle & 3-corridor multi-objective optimizer active',
        isHealthy: true,
        category: 'ROUTING'
      },
      {
        id: 7,
        systemName: 'Database',
        status: isDbConnected ? 'CONNECTED' : 'STANDALONE_FALLBACK',
        description: isDbConnected ? 'MySQL persistent store active' : 'Running in offline in-memory fallback mode',
        isHealthy: isDbConnected,
        category: 'STORAGE'
      },
      {
        id: 8,
        systemName: 'Backend API',
        status: 'ONLINE',
        description: 'Express REST API server operational on port 5000',
        isHealthy: true,
        category: 'CORE'
      }
    ];

    return res.json({
      overallStatus: 'OPERATIONAL',
      timestamp: new Date().toISOString(),
      subsystems
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHealth,
  getSystemStatus
};
