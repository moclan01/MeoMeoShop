import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../styles/Admin.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="language-container">
          <LanguageSwitcher />
        </div>

        <h3>{t('adminDashboard.title')}</h3>
        <nav>
          <ul>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => handleNavigate('/')}
              >
                {t('adminDashboard.home')}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => handleNavigate('/admin/products')}
              >
                {t('adminDashboard.products')}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => handleNavigate('/admin/categories')}
              >
                {t('adminDashboard.categories')}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => handleNavigate('/admin/orders')}
              >
                {t('adminDashboard.orders')}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => handleNavigate('/admin/customers')}
              >
                {t('adminDashboard.customers')}
              </button>
            </li>
            {/* Add more admin navigation buttons here */}
            <li>
              <button
                type="button"
                className="admin-logout-button"
                onClick={handleLogoutClick}
              >
                {t('adminDashboard.logout')}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-main-content">
        {/* The Outlet renders the matched child route component (Products, Orders, Customers) */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard; 