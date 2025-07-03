// File: src/components/FloatingHome.jsx
import React from 'react';
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg';
import '../styles/mobile.css';

export default function FloatingHome({ onClick }) {
  return (
    <button
      type="button"
      className="floating-home"
      onClick={onClick}
      aria-label="Home"
    >
      <HomeIcon aria-hidden="true" />
    </button>
  );
}
