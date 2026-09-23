import React from 'react';

export default function LiveHazardAlerts({
  riskScore = 80,
  riskLevel = 'HIGH',
  seaIce = 63,
  nearestIceberg = 24,
  icebergDensity = 17,
  navigationStatus = 'CAUTION'
}) {
  const getBannerData = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return {
          bannerClass: 'hazard-banner-critical',
          icon: '🚨',
          title: '🚨 CRITICAL HAZARD ALERT',
          color: 'var(--color-red)',
          message: 'High iceberg and sea-ice risk detected. Avoid the current route and review the recommended route.'
        };
      case 'HIGH':
        return {
          bannerClass: 'hazard-banner-high',
          icon: '⚠',
          title: '⚠ HIGH RISK ALERT',
          color: '#ff7043',
          message: 'Elevated environmental hazards detected. Proceed with caution and review the recommended route.'
        };
      case 'MODERATE':
        return {
          bannerClass: 'hazard-banner-moderate',
          icon: '🟡',
          title: '🟡 MODERATE RISK ALERT',
          color: 'var(--color-yellow)',
          message: 'Moderate environmental conditions detected. Continue monitoring before proceeding.'
        };
      case 'LOW':
      default:
        return {
          bannerClass: 'hazard-banner-low',
          icon: '✅',
          title: '✅ CONDITIONS SAFE',
          color: 'var(--color-green)',
          message: 'Current environmental conditions are suitable for continued monitoring.'
        };
    }
  };

  const getIcebergSubRisk = (dist, dens) => {
    if (dist < 20 || dens > 30) return { label: 'CRITICAL', color: 'var(--color-red)' };
    if (dist < 40 || dens > 15) return { label: 'HIGH', color: '#ff7043' };
    if (dist < 60 || dens > 5) return { label: 'MODERATE', color: 'var(--color-yellow)' };
    return { label: 'LOW', color: 'var(--color-green)' };
  };

  const getSeaIceSubRisk = (ice) => {
    if (ice > 75) return { label: 'CRITICAL', color: 'var(--color-red)' };
    if (ice > 50) return { label: 'MEDIUM', color: '#ff7043' };
    if (ice > 30) return { label: 'MODERATE', color: 'var(--color-yellow)' };
    return { label: 'LOW', color: 'var(--color-green)' };
  };

  const getRouteCondition = () => {
    switch (riskLevel) {
      case 'CRITICAL': return { label: 'AVOID', color: 'var(--color-red)' };
      case 'HIGH': return { label: 'CAUTION', color: '#ff7043' };
      case 'MODERATE': return { label: 'MONITOR', color: 'var(--color-yellow)' };
      case 'LOW': default: return { label: 'ACCEPTABLE', color: 'var(--color-green)' };
    }
  };

  const banner = getBannerData();
  const icebergSub = getIcebergSubRisk(nearestIceberg, icebergDensity);
  const seaIceSub = getSeaIceSubRisk(seaIce);
  const routeCond = getRouteCondition();

  return (
    <section className="alerts-container" aria-labelledby="live-alerts-title">
      <div className="section-header" style={{ marginBottom: 0 }}>
        <h2 id="live-alerts-title" className="section-title">
          <span>🚨</span> Live Hazard Alerts
        </h2>
        <span className="card-subtitle" style={{ margin: 0 }}>
          Real-Time Polar Proximity Engine
        </span>
      </div>

      {/* Large Dynamic Alert Banner */}
      <div className={`hazard-banner ${banner.bannerClass}`} role="alert">
        <div className="hazard-icon">{banner.icon}</div>
        <div className="hazard-info">
          <div className="hazard-headline" style={{ color: banner.color }}>
            {banner.title}
          </div>
          <div className="hazard-desc">
            {banner.message}
          </div>
        </div>
      </div>

      {/* 3 Smaller Alert Cards */}
      <div className="hazard-sub-grid">
        {/* Card 1: Iceberg Alert */}
        <div className="hazard-sub-card" style={{ borderLeft: `3px solid ${icebergSub.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>🧊</span> Iceberg Alert
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Nearest iceberg: <strong className="mono-text" style={{ color: '#fff' }}>{nearestIceberg} km</strong>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Risk: <strong style={{ color: icebergSub.color }}>{icebergSub.label}</strong>
          </div>
        </div>

        {/* Card 2: Sea-Ice Alert */}
        <div className="hazard-sub-card" style={{ borderLeft: `3px solid ${seaIceSub.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>🌊</span> Sea-Ice Alert
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Sea-ice concentration: <strong className="mono-text" style={{ color: '#fff' }}>{seaIce}%</strong>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Risk: <strong style={{ color: seaIceSub.color }}>{seaIceSub.label}</strong>
          </div>
        </div>

        {/* Card 3: Route Alert */}
        <div className="hazard-sub-card" style={{ borderLeft: `3px solid ${routeCond.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>🧭</span> Route Alert
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Overall status: <strong className="mono-text" style={{ color: '#fff' }}>{navigationStatus}</strong>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Route condition: <strong style={{ color: routeCond.color }}>{routeCond.label}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
