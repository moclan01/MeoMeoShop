import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  if (!user) {
    return <div className="profile-container">Đang tải thông tin người dùng hoặc bạn chưa đăng nhập.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Thông tin tài khoản</h2>
      <div className="profile-details">
        <p><strong>ID Người dùng:</strong> {user.userId}</p>
        <p><strong>Tên:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Điện thoại:</strong> {user.phone || 'Chưa cập nhật'}</p>
        <p><strong>Địa chỉ:</strong> {user.address || 'Chưa cập nhật'}</p>
        <p><strong>Vai trò:</strong> {user.role}</p>
        {/* Có thể thêm nút sửa thông tin, đổi mật khẩu tại đây */}
      </div>
      {/* Nút đăng xuất */}
      <button className="logout-button" onClick={handleLogoutClick}>Đăng xuất</button>
    </div>
  );
}

export default Profile; 