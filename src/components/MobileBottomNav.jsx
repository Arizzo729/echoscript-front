// -----------------------------------------------------------------------------
// MobileBottomNav.jsx – Bubble-Style Bottom Navigation
// -----------------------------------------------------------------------------
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/mobile.module.css';

export default function MobileBottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className="nav-item" activeClassName="active">
        <img src="/icons/home.svg" alt="Home" />
        <div>Home</div>
      </NavLink>
      <NavLink to="/dashboard" className="nav-item" activeClassName="active">
        <img src="/icons/dashboard.svg" alt="Dashboard" />
        <div>Dashboard</div>
      </NavLink>
      <NavLink to="/upload" className="nav-item" activeClassName="active">
        <img src="/icons/upload.svg" alt="Upload" />
        <div>Upload</div>
      </NavLink>
      <NavLink to="/shop" className="nav-item" activeClassName="active">
        <img src="/icons/shop.svg" alt="Shop" />
        <div>Shop</div>
      </NavLink>
    </nav>
  );
}


