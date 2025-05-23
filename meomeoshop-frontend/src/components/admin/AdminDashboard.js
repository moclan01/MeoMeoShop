import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../styles/Admin.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <ul>
            <li>
              <Link to="/admin/products">Quản lý Sản phẩm</Link>
            </li>
            <li>
              <Link to="/admin/categories">Quản lý Danh mục</Link>
            </li>
            <li>
              <Link to="/admin/orders">Quản lý Đơn hàng</Link>
            </li>
            <li>
              <Link to="/admin/customers">Quản lý Khách hàng</Link>
            </li>
            {/* Add more admin navigation links here */}
            <li>
                <Link to="/">Thoát Admin</Link>
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