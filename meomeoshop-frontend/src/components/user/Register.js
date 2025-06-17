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
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = t('registerPage.nameRequired');
    } else if (name.trim().length < 2) {
      newErrors.name = t('registerPage.nameMinLength');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = t('registerPage.emailRequired');
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = t('registerPage.emailInvalid');
    }

    // Validate phone (optional, but must be valid if provided)
    const phoneRegex = /^\+?\d{10,11}$/;
    if (phone.trim() && !phoneRegex.test(phone.trim())) {
      newErrors.phone = t('registerPage.phoneInvalid');
    }

    // Validate address (optional, but must be valid if provided)
    if (address.trim() && address.trim().length < 5) {
      newErrors.address = t('registerPage.addressMinLength');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      newErrors.password = t('registerPage.passwordRequired');
    } else if (!passwordRegex.test(password)) {
      newErrors.password = t('registerPage.passwordInvalid');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('registerPage.confirmPasswordRequired');
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = t('registerPage.confirmPasswordMatchError');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }



  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    const registrationData = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      phone: phone.trim() || null,
      address: address.trim() || null,
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
            setErrors({ email: t('registerPage.emailExists') });
          } else if (response.status === 400) {
            setErrors({ general: t('registerPage.invalidData') });
          } else {
            setErrors({ general: t('registerPage.registerFailed', { error: errorMsg }) });
          }
          throw new Error(response.statusText || 'Registration failed');
        }
        return data;
      })
      .then(data => {
        console.log('Đăng ký thành công:', data);
        setSuccess(t('registerPage.registerSuccess'));
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      })
      .catch(error => {
        console.error('Lỗi khi gọi API đăng ký:', error);
        if (!error) {
          setErrors({ general: t('registerPage.registerError') });
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
              className={errors.name ? 'error-input' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errors.email ? 'error-input' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">{t('profile.phone')}:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? 'error-input' : ''}
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="address">{t('profile.address')}:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={errors.address ? 'error-input' : ''}
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={errors.password ? 'error-input' : ''}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={errors.confirmPassword ? 'error-input' : ''}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          {errors.general && <div className="error-message">{errors.general}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="auth-button">{t('common.register')}</button>
        </form>
        <Link to="/login" className="auth-link">
          {t('auth.haveAccount')} <Link to="/login">{t('common.login')}</Link>
        </Link>
      </div>
    </div>
  );
}

export default Register; 