// src/components/MobileBottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg';
import { ReactComponent as DashboardIcon } from '../assets/icons/dashboard.svg';
import { ReactComponent as UploadIcon } from '../assets/icons/upload.svg';
import { ReactComponent as ShopIcon } from '../assets/icons/shop.svg';
import '../styles/mobile.css';

export default function MobileBottomNav() {
  return (
    <nav className="bottom-nav">
      {/** Use concise map to reduce repetition */}
      {[
        { to: '/', Icon: HomeIcon, label: 'Home' },
        { to: '/dashboard', Icon: DashboardIcon, label: 'Dashboard' },
        { to: '/upload', Icon: UploadIcon, label: 'Upload' },
        { to: '/shop', Icon: ShopIcon, label: 'Shop' }
      ].map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon className="nav-icon" aria-hidden="true" />
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}


/* src/styles/mobile.css */
@media (max-width: 768px) {
  .bottom-nav {
    position: fixed;
    bottom: env(safe-area-inset-bottom, 8px);
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 480px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 9999px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 1000;
  }

  .bottom-nav .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: var(--color-secondary-text);
    font-size: 10px;
    transition: color 0.2s;
    padding: 4px;
  }

  .bottom-nav .nav-item.active,
  .bottom-nav .nav-item:hover {
    color: var(--color-primary);
  }

  .bottom-nav .nav-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 2px;
    fill: currentColor;
    transition: transform 0.2s;
  }

  .bottom-nav .nav-item.active .nav-icon {
    transform: scale(1.1);
  }

  .bottom-nav .nav-label {
    line-height: 1;
  }
}

