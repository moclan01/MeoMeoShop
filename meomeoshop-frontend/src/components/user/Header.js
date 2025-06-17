import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import MeoMeoLogo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";

function Header({ cart, loggedInUser }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const { t } = useTranslation();

  // If we're on an admin page, don't render the header
  if (isAdminPage) {
    return null;
  }

  // Calculate the total number of unique items in the cart
  const totalItems = cart?.items ? cart.items.length : 0;

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
            <li>
              <Link to="/">{t("common.home")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("common.contact")}</Link>
            </li>
            {loggedInUser && loggedInUser.role === 'admin' && (
              <li>
                <Link to="/admin">{t("common.admin")}</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="header-right">
        <Link to="/cart" className="header-icon">
          <FontAwesomeIcon icon={faShoppingCart} />
          <sup>{totalItems}</sup>
        </Link>

        {/* User Account Icon - Conditional rendering based on login status */}
        {loggedInUser ? (
          // Nếu người dùng đã đăng nhập, hiển thị tên hoặc biểu tượng khác
          <Link to="/profile" className="header-icon user-loggedIn">
            {/* Có thể thay thế bằng tên người dùng: {loggedInUser.name} */}
            <FontAwesomeIcon icon={faUser} />
            {/* Tùy chọn: thêm dropdown menu cho profile, logout, etc. */}
          </Link>
        ) : (
          // Nếu chưa đăng nhập, hiển thị liên kết Login
          <Link to="/login" className="header-icon">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        )}
        <LanguageSwitcher />
      </div>
    </header>
  );
}

export default Header;
