import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthForm.css';

function Login({ role }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Add state for error messages or loading state if needed

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log(`Attempting to login as ${role || 'user'} with:`, { email, password });
    // You will need to integrate with your backend authentication API here
    // Based on the 'role' prop, you might call different API endpoints or handle responses differently
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
          {/* Add error message display here if needed */}
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