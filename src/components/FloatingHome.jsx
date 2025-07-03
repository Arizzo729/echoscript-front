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

/* src/styles/mobile.css */
@media (max-width: 768px) {
  .floating-home {
    position: fixed;
    bottom: calc(env(safe-area-inset-bottom, 16px) + 16px);
    right: 16px;
    width: 56px;
    height: 56px;
    background: rgba(0, 122, 255, 0.85);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
    z-index: 1001;
  }

  .floating-home:hover,
  .floating-home:focus {
    background: rgba(0, 122, 255, 1);
    transform: scale(1.05);
    outline: none;
  }

  .floating-home-icon {
    width: 28px;
    height: 28px;
    fill: #fff;
  }
}
