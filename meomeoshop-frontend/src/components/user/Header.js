import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import MeoMeoLogo from '../../assets/logo.png';

function Header({ cartItems }) {
  // Calculate the total number of unique items in the cart
  const totalItems = cartItems ? cartItems.length : 0;

  return (
    <header className="header-container">
      <div className="header-left">
        <div className="header-logo">
          <Link to="/">
            <img src={MeoMeoLogo} alt="Meo Meo Shop Logo" />
          </Link>
        </div>
        <nav className="header-nav">
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/products">Sản phẩm</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </nav>
      </div>
      <div className="header-right">
        {/* Removed Search Bar */}
        {/* <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input" 
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div> */}
        <Link to="/cart" className="header-icon"><FontAwesomeIcon icon={faShoppingCart} /><sup>{totalItems}</sup></Link>
        {/* User Account Icon */}
        <Link to="/account" className="header-icon"><FontAwesomeIcon icon={faUser} /></Link>
      </div>
    </header>
  );
}

export default Header; 