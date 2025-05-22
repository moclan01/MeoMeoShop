import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import MeoMeoLogo from '../assets/logo.png';

function Header() {
  return (
    <header className="header-container">
      <div className="header-left">
        <div className="header-logo">
          {/* Placeholder for logo */}
          <img src={MeoMeoLogo} alt="Meo Meo Shop Logo" />
        </div>
        <nav className="header-nav">
          <ul>
            <li><a href="#">Trang chủ</a></li>
            <li><a href="#">Sản phẩm</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </nav>
      </div>
      <div className="header-right">
        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." className="search-input" />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <span className="header-icon"><FontAwesomeIcon icon={faShoppingCart} /><sup>0</sup></span>
        {/* User Account Icon */}
        <span className="header-icon"><FontAwesomeIcon icon={faUser} /></span>
      </div>
    </header>
  );
}

export default Header; 