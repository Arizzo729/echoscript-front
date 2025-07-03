// -----------------------------------------------------------------------------
// FloatingHome.jsx – Quick Return to Home Button
// -----------------------------------------------------------------------------
import React from 'react';
import { useHistory } from 'react-router-dom';
import './src/styles/mobile.css';

export function FloatingHome() {
  const history = useHistory();
  return (
    <div className="floating-home" onClick={() => history.push('/home')}>
      <img src="/icons/home-white.svg" alt="Home" />
    </div>
  );
}
