import React from 'react';

export default function LoadingIndicator({ message = 'Analyzing route...' }) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-spinner"></div>
      <div className="loading-text">
        <span>❄</span> {message}
      </div>
    </div>
  );
}
