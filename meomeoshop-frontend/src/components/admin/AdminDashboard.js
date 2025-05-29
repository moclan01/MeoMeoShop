import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();

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
        <h3>Admin Panel</h3>
        <nav>
          <ul>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => handleNavigate('/admin/products')}
              >
                Quản lý Sản phẩm
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => handleNavigate('/admin/categories')}
              >
                Quản lý Danh mục
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => handleNavigate('/admin/orders')}
              >
                Quản lý Đơn hàng
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-button"
                onClick={() => handleNavigate('/admin/customers')}
              >
                Quản lý Khách hàng
              </button>
            </li>
            {/* Add more admin navigation buttons here */}
            <li>
              <button
                type="button"
                className="admin-logout-button"
                onClick={handleLogoutClick}
              >
                Đăng xuất
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