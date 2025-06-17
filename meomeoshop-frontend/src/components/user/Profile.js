import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Profile.css';

function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUser(null);
      }
    }
  }, []); // Chạy effect chỉ một lần khi component mount

  // Hàm xử lý khi nút đăng xuất được nhấn
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout(); // Gọi hàm logout từ App.js
    }
    navigate('/'); // Điều hướng về trang chủ sau khi đăng xuất
  };

  const handleViewOrdersClick = () => {
    navigate('/user/orders'); // Điều hướng đến trang danh sách đơn hàng
  };


  if (!user) {
    return <div className="profile-container">{t('profile.loading')}</div>;
  }

  return (
    <div className="profile-container">
      <h2>{t('profile.title')}</h2>
      <div className="profile-details">
        <p><strong>{t('profile.userId')}:</strong> {user.userId}</p>
        <p><strong>{t('profile.name')}:</strong> {user.name}</p>
        <p><strong>{t('profile.email')}:</strong> {user.email}</p>
        <p><strong>{t('profile.phone')}:</strong> {user.phone || t('profile.notUpdated')}</p>
        <p><strong>{t('profile.address')}:</strong> {user.address || t('profile.notUpdated')}</p>
        <p><strong>{t('profile.role')}:</strong> {user.role}</p>
        {/* Có thể thêm nút sửa thông tin, đổi mật khẩu tại đây */}
      </div>
      <button className="logout-button" onClick={handleViewOrdersClick}>
          {t('profile.viewOrders')}
        </button>
      {/* Nút đăng xuất */}
      <button className="logout-button" onClick={handleLogoutClick}>{t('profile.logout')}</button>
    </div>
  );
}

export default Profile; 