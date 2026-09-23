import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import DisclaimerBanner from './components/DisclaimerBanner';
import NavigationPlanning from './components/NavigationPlanning';
import RiskDashboard from './components/RiskDashboard';
import EnvironmentalControls from './components/EnvironmentalControls';
import AiConfidencePanel from './components/AiConfidencePanel';
import PolarMap from './components/PolarMap';
import NavigationStatus from './components/NavigationStatus';
import RouteComparison from './components/RouteComparison';
import LiveHazardAlerts from './components/LiveHazardAlerts';
import EnvironmentalMonitoring from './components/EnvironmentalMonitoring';
import SystemStatus from './components/SystemStatus';
import LoadingIndicator from './components/LoadingIndicator';
import {
  fetchHealth,
  fetchEnvironment,
  updateEnvironmentAPI,
  fetchIcebergs,
  analyzeRouteAPI,
  fallbackIcebergs
} from './services/api';
import { evaluateFullRisk, calculateWaypoints } from './services/riskCalculator';

export default function App() {
  // Navigation Points (default Antarctic research expedition demo coordinates)
  const [startPoint, setStartPoint] = useState({
    lat: -60.2168,
    lng: -45.1617,
    name: 'South Orkney Base Alpha'
  });

  const [destPoint, setDestPoint] = useState({
    lat: -60.5642,
    lng: 62.7921,
    name: 'Mawson Sector Target'
  });

  // Environmental Controls State
  const [seaIce, setSeaIce] = useState(63);
  const [nearestIceberg, setNearestIceberg] = useState(24);
  const [icebergDensity, setIcebergDensity] = useState(17);

  // Icebergs data
  const [icebergs, setIcebergs] = useState(fallbackIcebergs);

  // System status state
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState('Initial Setup');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Evaluated Risk State (instant client-side evaluation based on rule-based engine)
  const calculatedData = useMemo(() => {
    return evaluateFullRisk(seaIce, nearestIceberg, icebergDensity, startPoint, destPoint);
  }, [seaIce, nearestIceberg, icebergDensity, startPoint, destPoint]);

  // Check health and load initial backend data
  const refreshBackendStatus = useCallback(async () => {
    const health = await fetchHealth();
    setIsBackendOnline(health.status === 'online');
    setIsDbConnected(health.database === 'connected');

    const ibData = await fetchIcebergs();
    if (ibData && ibData.length > 0) {
      setIcebergs(ibData);
    }
  }, []);

  useEffect(() => {
    refreshBackendStatus();
    const interval = setInterval(refreshBackendStatus, 15000);
    return () => clearInterval(interval);
  }, [refreshBackendStatus]);

  // Debounced sync of environmental slider values to backend
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isBackendOnline) {
        updateEnvironmentAPI({
          seaIceConcentration: seaIce,
          nearestIcebergDistance: nearestIceberg,
          icebergDensity: icebergDensity
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [seaIce, nearestIceberg, icebergDensity, isBackendOnline]);

  // Handle map click: 1st click = start, 2nd click = dest, 3rd click = start again
  const handleMapClick = (latlng) => {
    if (!startPoint || (startPoint && destPoint)) {
      setStartPoint({
        lat: latlng.lat,
        lng: latlng.lng,
        name: `Waypoint (${latlng.lat.toFixed(3)}°, ${latlng.lng.toFixed(3)}°)`
      });
      setDestPoint(null);
    } else if (startPoint && !destPoint) {
      setDestPoint({
        lat: latlng.lat,
        lng: latlng.lng,
        name: `Target (${latlng.lat.toFixed(3)}°, ${latlng.lng.toFixed(3)}°)`
      });
      const now = new Date();
      setLastAnalysisTime(now.toLocaleTimeString());
    }
  };

  // Analyze Route Button Action
  const handleAnalyzeRoute = async () => {
    if (!startPoint || !destPoint) return;

    setIsLoading(true);
    setLoadingMessage('Analyzing route & computing safe corridors...');

    const payload = {
      start: { lat: startPoint.lat, lng: startPoint.lng, name: startPoint.name },
      destination: { lat: destPoint.lat, lng: destPoint.lng, name: destPoint.name },
      environmentalData: {
        seaIceConcentration: seaIce,
        nearestIcebergDistance: nearestIceberg,
        icebergDensity: icebergDensity
      }
    };

    try {
      if (isBackendOnline) {
        const result = await analyzeRouteAPI(payload);
        if (result) {
          console.log('✅ Route analysis persisted:', result);
        }
      }
    } catch (err) {
      console.warn('⚠️ Route analysis error fallback:', err);
    } finally {
      // Simulate realistic telemetry processing feedback
      setTimeout(() => {
        setIsLoading(false);
        const now = new Date();
        setLastAnalysisTime(now.toLocaleTimeString());
      }, 500);
    }
  };

  // Reset Route Action
  const handleResetRoute = () => {
    setStartPoint(null);
    setDestPoint(null);
    setLastAnalysisTime(null);
  };

  // Computed waypoints for green route
  const recommendedWaypoints = useMemo(() => {
    if (startPoint && destPoint) {
      return calculateWaypoints(startPoint, destPoint);
    }
    return null;
  }, [startPoint, destPoint]);

  return (
    <div className="app-root">
      {/* Top Header */}
      <Header
        systemOnline={isBackendOnline}
        dbConnected={isDbConnected}
      />

      {/* Main Dashboard Container */}
      <main className="app-container">
        {/* Safety Disclaimer Banner */}
        <DisclaimerBanner />

        {/* SECTION 1: Navigation Planning */}
        <NavigationPlanning
          startPoint={startPoint}
          destPoint={destPoint}
          onAnalyze={handleAnalyzeRoute}
          onReset={handleResetRoute}
          isLoading={isLoading}
        />

        {/* SECTION 2: Risk Dashboard (6 Cards) */}
        <RiskDashboard
          riskScore={calculatedData.riskScore}
          riskLevel={calculatedData.riskLevel}
          seaIce={seaIce}
          nearestIceberg={nearestIceberg}
          icebergDensity={icebergDensity}
          navigationStatus={calculatedData.navigationStatus}
        />

        {/* SECTION 3: Environmental Data Controls (Sliders) */}
        <EnvironmentalControls
          seaIce={seaIce}
          setSeaIce={setSeaIce}
          nearestIceberg={nearestIceberg}
          setNearestIceberg={setNearestIceberg}
          icebergDensity={icebergDensity}
          setIcebergDensity={setIcebergDensity}
        />

        {/* SECTION 3.5: AI Analysis Confidence */}
        <AiConfidencePanel
          seaIce={seaIce}
          nearestIceberg={nearestIceberg}
          icebergDensity={icebergDensity}
          riskScore={calculatedData.riskScore}
        />

        {/* SECTION 4 & 5: Map + Navigation Status (Two-Column Desktop Grid) */}
        <div className="map-status-layout">
          {/* Section 4: Antarctic Navigation Map */}
          <PolarMap
            startPoint={startPoint}
            destPoint={destPoint}
            recommendedWaypoints={recommendedWaypoints}
            onMapClick={handleMapClick}
            icebergs={icebergs}
          />

          {/* Section 5: Navigation Status Side Panel */}
          <NavigationStatus
            riskScore={calculatedData.riskScore}
            riskLevel={calculatedData.riskLevel}
            seaIce={seaIce}
            nearestIceberg={nearestIceberg}
            icebergDensity={icebergDensity}
            decision={calculatedData.decision}
            recommendation={calculatedData.recommendation}
            navigationStatus={calculatedData.navigationStatus}
          />
        </div>

        {/* SECTION 6: Route Comparison */}
        <RouteComparison
          selectedRisk={calculatedData.routeComparison.selectedRouteRisk}
          recommendedRisk={calculatedData.routeComparison.recommendedRouteRisk}
          delta={calculatedData.routeComparison.delta}
          isAnalyzed={Boolean(startPoint && destPoint)}
        />

        {/* SECTION 7: Live Hazard Alerts */}
        <LiveHazardAlerts
          riskScore={calculatedData.riskScore}
          riskLevel={calculatedData.riskLevel}
          seaIce={seaIce}
          nearestIceberg={nearestIceberg}
          icebergDensity={icebergDensity}
          navigationStatus={calculatedData.navigationStatus}
        />

        {/* SECTION 8: Environmental Monitoring */}
        <EnvironmentalMonitoring
          seaIce={seaIce}
          nearestIceberg={nearestIceberg}
          icebergDensity={icebergDensity}
        />

        {/* SECTION 9: System Status */}
        <SystemStatus
          isBackendOnline={isBackendOnline}
          isDbConnected={isDbConnected}
          lastAnalysisTime={lastAnalysisTime}
        />
      </main>

      {/* Loading Overlay */}
      {isLoading && <LoadingIndicator message={loadingMessage} />}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          POLAR-SAFE AI &copy; 2026 | Antarctic Sea-Ice, Iceberg Trajectory &amp; Navigation Decision Support System
        </p>
        <p style={{ fontSize: '0.72rem', marginTop: '0.35rem', color: 'var(--text-dim)' }}>
          Research decision-support tool. Not approved for autonomous vessel maneuvering. All telemetry simulated.
        </p>
      </footer>
    </div>
  );
}
