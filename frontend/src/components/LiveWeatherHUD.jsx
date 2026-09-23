import React from 'react';

export default function LiveWeatherHUD({ liveWeather, onRefreshWeather }) {
  const wind = liveWeather?.wind || { speedKnots: 22.4, directionDeg: 240, cardinal: 'WSW', gustKnots: 29.5 };
  const sea = liveWeather?.sea || { surfaceTempC: -1.8, waveHeightMeters: 2.6, currentSpeedKnots: 0.7, currentDirectionDeg: 120 };
  const atmo = liveWeather?.atmosphere || { airTempC: -9.5, visibilityKm: 7.2, surfacePressureHpa: 986.5, icingRisk: 'HIGH_SUPERSTRUCTURE_ICING' };
  const source = liveWeather?.source || 'Open-Meteo Marine / ECMWF Feed';

  return (
    <section className="polar-card weather-hud-card" aria-label="Antarctic Live Marine Telemetry">
      <div className="card-header-row">
        <div className="card-title-group">
          <span className="card-title-icon">🛰️</span>
          <h2 className="card-title">Antarctic Marine Weather &amp; Oceanography</h2>
          <span className="badge-source">{source}</span>
        </div>
        <button
          onClick={onRefreshWeather}
          className="btn-hud-refresh"
          title="Refresh live polar weather"
        >
          🔄 Sync Marine API
        </button>
      </div>

      <div className="weather-hud-grid">
        {/* 1. Wind Vector & Direction */}
        <div className="weather-hud-box">
          <div className="hud-box-label">
            <span>💨</span> Wind Velocity &amp; Heading
          </div>
          <div className="hud-box-main">
            <div className="hud-large-val">
              {wind.speedKnots} <span className="hud-unit">kts</span>
            </div>
            <div className="hud-wind-compass">
              <span
                className="wind-arrow"
                style={{ transform: `rotate(${wind.directionDeg}deg)` }}
              >
                ⬆
              </span>
              <span className="wind-heading-text">
                {wind.directionDeg}&deg; ({wind.cardinal})
              </span>
            </div>
          </div>
          <div className="hud-box-sub">
            Gusts: <strong>{wind.gustKnots} kts</strong> | Force: <strong>Beaufort 6</strong>
          </div>
        </div>

        {/* 2. Sea State & Waves */}
        <div className="weather-hud-box">
          <div className="hud-box-label">
            <span>🌊</span> Significant Wave Height
          </div>
          <div className="hud-box-main">
            <div className="hud-large-val" style={{ color: sea.waveHeightMeters > 3.0 ? '#ff7043' : '#38bdf8' }}>
              {sea.waveHeightMeters} <span className="hud-unit">m</span>
            </div>
            <div className="hud-sub-metric">
              <div>Swell Period: <strong>{sea.wavePeriodSeconds || 7.5}s</strong></div>
              <div>Current: <strong>{sea.currentSpeedKnots} kts @ {sea.currentDirectionDeg}&deg;</strong></div>
            </div>
          </div>
          <div className="hud-box-sub">
            Polar Ocean Drag: <strong>Active Left Coriolis Deflection</strong>
          </div>
        </div>

        {/* 3. Sea & Air Temperatures */}
        <div className="weather-hud-box">
          <div className="hud-box-label">
            <span>🌡️</span> Sea Surface Temp (SST)
          </div>
          <div className="hud-box-main">
            <div className="hud-large-val" style={{ color: '#00d4ff' }}>
              {sea.surfaceTempC}&deg;C
            </div>
            <div className="hud-sub-metric">
              <div>Air Temp: <strong>{atmo.airTempC}&deg;C</strong></div>
              <div>Visibility: <strong>{atmo.visibilityKm} km</strong></div>
            </div>
          </div>
          <div className="hud-box-sub">
            Pressure: <strong>{atmo.surfacePressureHpa} hPa</strong> (Polar Low)
          </div>
        </div>

        {/* 4. Superstructure Icing Alert */}
        <div className="weather-hud-box hud-icing-box">
          <div className="hud-box-label">
            <span>❄️</span> Superstructure Icing Risk
          </div>
          <div className="hud-icing-content">
            <span className="icing-badge">
              {atmo.icingRisk === 'HIGH_SUPERSTRUCTURE_ICING' ? '⚠️ HIGH ICING RISK' : 'MODERATE'}
            </span>
            <p className="icing-desc">
              Sub-zero spray freezing on decks and radar masts. Anti-icing systems &amp; steam tracing active.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
