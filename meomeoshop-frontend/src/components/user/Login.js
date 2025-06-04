import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/AuthForm.css';

const Login = ({ role, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tạo dữ liệu form-data
      const loginData = new URLSearchParams();
      loginData.append('email', email);
      loginData.append('password', password);

      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: loginData.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data);
        // Điều hướng dựa trên role
        if (data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || t('LoginError'));
      }
    } catch (err) {
      setError(t('LoginError'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <h2>{t('common.login')}{role === 'admin' ? ' Admin' : ''}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            {t('common.login')}
          </button>
        </form>
        {role !== 'admin' && (
          <Link to="/register" className="auth-link">{t('auth.noAccount')} {t('common.register')}</Link>
        )}
        <div className="auth-links">
          <Link to="/forgot-password">{t('auth.forgotPassword')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 