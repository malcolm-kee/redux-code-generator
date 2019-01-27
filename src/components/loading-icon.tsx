import * as React from 'react';
import './loading-icon.css';

export const LoadingIcon = () => (
  <div className="loading-icon" role="progressbar">
    <div className="loading-icon-container">
      <svg viewBox="22 22 44 44">
        <circle fill="none" cx="44" cy="44" r="16" strokeWidth="3" />
      </svg>
    </div>
  </div>
);
