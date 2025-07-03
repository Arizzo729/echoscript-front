// File: src/components/MobileBottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
// Import SVGs as React components via SVGR:
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg';
import { ReactComponent as DashboardIcon } from '../assets/icons/dashboard.svg';
import { ReactComponent as UploadIcon } from '../assets/icons/upload.svg';
import { ReactComponent as ShopIcon } from '../assets/icons/shop.svg';
import '../styles/mobile.css';

export default function MobileBottomNav() {
  const links = [
    { to: '/', Icon: HomeIcon, label: 'Home' },
    { to: '/dashboard', Icon: DashboardIcon, label: 'Dashboard' },
    { to: '/upload', Icon: UploadIcon, label: 'Upload' },
    { to: '/shop', Icon: ShopIcon, label: 'Shop' },
  ];

  return (
    <nav className="bottom-nav">
      {links.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon className="nav-icon" aria-hidden />
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

// -- Alternative fallback without SVGR --
// If you prefer not to use SVGR, import SVGs as URLs and render with <img>:
// import homeSrc from '../assets/icons/home.svg';
// ...
// <img src={homeSrc} className="nav-icon" alt="Home" />



