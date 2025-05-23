import React from 'react';
import '../styles/LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Đang tải...</p>
    </div>
  );
}

export default LoadingSpinner; 