import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthForm.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Add state for error messages or loading state if needed

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle registration logic here
    console.log('Attempting to register with:', { email, password, confirmPassword });
    // You will need to integrate with your backend registration API here
    // Add password confirmation validation
  };

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <h2>Đăng ký tài khoản</h2>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {/* Add error message display here if needed */}
          <button type="submit" className="auth-button">Đăng ký</button>
        </form>
        <Link to="/login" className="auth-link">Đã có tài khoản? Đăng nhập</Link>
      </div>
    </div>
  );
}

export default Register; 