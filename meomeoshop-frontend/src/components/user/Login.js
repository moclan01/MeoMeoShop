import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

function Login({ role, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State để lưu thông báo lỗi
  const navigate = useNavigate(); // Khởi tạo useNavigate hook

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Xóa lỗi cũ khi submit

    // Tạo dữ liệu form-data
    const loginData = new URLSearchParams();
    loginData.append('email', email);
    loginData.append('password', password);

    // Gọi API đăng nhập
    fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Có thể cần thêm CORS headers nếu chạy frontend và backend trên các cổng khác nhau
        // 'Access-Control-Allow-Origin': '*'
      },
      body: loginData.toString(),
    })
    .then(response => {
      if (!response.ok) {
        // Xử lý lỗi từ backend (ví dụ: sai email/mật khẩu)
        // Backend trả về HttpStatus.UNAUTHORIZED (401) hoặc HttpStatus.BAD_REQUEST (400)
        // Có thể đọc body response để lấy thông báo lỗi chi tiết nếu backend trả về
        throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
      }
      return response.json(); // Chuyển đổi response sang JSON
    })
    .then(data => {
      console.log('Đăng nhập thành công:', data);
      // Xử lý sau khi đăng nhập thành công:
      // - Lưu thông tin người dùng (ví dụ: token, userId, role) vào state hoặc local storage
      // - Điều hướng người dùng đến trang phù hợp dựa trên role (ví dụ: trang admin, trang người dùng)
      //   Ví dụ đơn giản: window.location.href = '/dashboard';

      // Gọi hàm onLoginSuccess để cập nhật state ở App.js và lưu vào localStorage
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }

      // Điều hướng dựa trên role
      if (data.role === 'ADMIN') {
        console.log('Admin login');
        navigate('/admin/dashboard'); // Điều hướng đến trang admin
      } else {
        console.log('User login');
        navigate('/'); // Điều hướng về trang chủ hoặc trang người dùng mặc định
      }
    })
    .catch(error => {
      console.error('Lỗi khi gọi API đăng nhập:', error);
      setError(error.message); // Hiển thị lỗi cho người dùng
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <h2>Đăng nhập{role === 'admin' ? ' Admin' : ''}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>} {/* Hiển thị lỗi */}
          <button type="submit" className="auth-button">Đăng nhập</button>
        </form>
        {role !== 'admin' && (
          <Link to="/register" className="auth-link">Chưa có tài khoản? Đăng ký ngay</Link>
        )}
      </div>
    </div>
  );
}

export default Login; 