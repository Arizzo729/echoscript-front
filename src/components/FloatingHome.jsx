// src/components/FloatingHome.jsx
import React from 'react';
// React Router v6: useNavigate replaces useHistory
import { useNavigate } from 'react-router-dom';
import '../styles/mobile.css';

const FloatingHome = () => {
  const navigate = useNavigate();

  // Navigate to root (home)
  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="floating-home" onClick={goHome}>
      <img src="/icons/home.svg" alt="Home" />
    </div>
  );
};

export default FloatingHome;
