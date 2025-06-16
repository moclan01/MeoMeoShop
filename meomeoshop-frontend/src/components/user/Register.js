import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/AuthForm.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = t('validation.nameRequired');
    } else if (name.trim().length < 2) {
      newErrors.name = t('validation.nameMinLength');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = t('validation.emailInvalid');
    }

    // Validate phone (optional, but must be valid if provided)
    const phoneRegex = /^\+?\d{10,11}$/;
    if (phone.trim() && !phoneRegex.test(phone.trim())) {
      newErrors.phone = t('validation.phoneInvalid');
    }

    // Validate address (optional, but must be valid if provided)
    if (address.trim() && address.trim().length < 5) {
      newErrors.address = t('validation.addressMinLength');
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      newErrors.password = t('validation.passwordRequired');
    } else if (!passwordRegex.test(password)) {
      newErrors.password = t('validation.passwordInvalid');
    }

    // Validate confirmPassword
    if (!confirmPassword) {
      newErrors.confirmPassword = t('validation.confirmPasswordRequired');
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = t('validation.confirmPasswordMatchError');
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('registerPage.confirmPasswordMatchError'));
      return;
    }

    const registrationData = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      address: address
    };

    fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })
    .then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const errorMsg = data && data.message ? data.message : response.status;
        if (response.status === 409) {
            setError('Email đã tồn tại. Vui lòng sử dụng email khác.');
        } else if (response.status === 400) {
             setError('Dữ liệu đăng ký không hợp lệ. Vui lòng kiểm tra lại thông tin.');
        } else {
            setError('Đăng ký thất bại. Vui lòng thử lại.' + (data ? ': ' + (data.message || JSON.stringify(data)) : ''));
        }
        throw new Error(response.statusText || 'Registration failed');
      }
      return data;
    })
    .then(data => {
      console.log('Đăng ký thành công:', data);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
       setTimeout(() => {
         navigate('/login');
       }, 2000);
    })
    .catch(error => {
      console.error('Lỗi khi gọi API đăng ký:', error);
      if (!error) {
         setError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
      }
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <h2>{t('registerPage.title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('profile.name')}:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
           <div className="form-group">
            <label htmlFor="phone">{t('profile.phone')}:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">{t('profile.address')}:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="auth-button">{t('common.register')}</button>
        </form>
        <Link to="/login" className="auth-link">{t('auth.noAccount')} <Link to="/login">{t('common.login')}</Link></Link>
      </div>
    </div>
  );
}

export default Register; 