import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/OrderSuccess.css';

function OrderSuccess() {
  const { t } = useTranslation();

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>{t('orderSuccess.title')}</h1>
        <p>{t('orderSuccess.message')}</p>
        <div className="success-actions">
          <Link to="/" className="continue-shopping">
            {t('orderSuccess.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess; 