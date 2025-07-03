// src/components/FloatingHome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg';
import '../styles/mobile.css';

export default function FloatingHome() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="floating-home"
      aria-label="Go to Home"
      onClick={() => navigate('/')}
    >
      <HomeIcon className="floating-home-icon" aria-hidden="true" />
    </button>
  );
}

