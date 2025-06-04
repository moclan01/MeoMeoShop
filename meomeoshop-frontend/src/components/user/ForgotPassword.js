import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/AuthForm.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage(t('auth.passwordResetSuccess'));
        setError('');
        setEmailSent(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || t('auth.resetPasswordError'));
        setMessage('');
      }
    } catch (err) {
      setError(t('auth.resetPasswordError'));
      setMessage('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <h2>{t('auth.forgotPassword')}</h2>
        {error && <div className="error-message">{error}</div>}

        {!emailSent ? (
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
            <button type="submit" className="auth-button">
              {t('auth.sendResetLink')}
            </button>
          </form>
        ) : (
          <div className="email-sent-message">
            <p>{t('auth.passwordResetSuccess')}</p>
            <p>{t('auth.checkEmailInstructions')}</p>
          </div>
        )}

        <div className="auth-links">
          <Link to="/login">{t('auth.backToLogin')}</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 