import React from 'react';

export default function Header({ systemOnline = true, dbConnected = false }) {
  const isOnline = systemOnline;

  return (
    <header className="header-container">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo" aria-label="Polar Safe Logo">🧊</div>
          <div className="header-title-block">
            <h1>POLAR-SAFE <span>AI</span></h1>
            <p className="header-subtitle">
              Antarctic Sea-Ice, Iceberg Trajectory &amp; Navigation Decision Support System
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div
            className={`system-badge-pill ${isOnline ? 'system-badge-online' : 'system-badge-offline'}`}
            title={isOnline ? 'Connected to backend service' : 'Operating in fallback client-side mode'}
          >
            <span className="pulse-dot"></span>
            <span>{isOnline ? '● SYSTEM ONLINE' : '● BACKEND OFFLINE'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
