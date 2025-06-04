import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>{t('footer.shopName')}</h3>
          <p>{t('footer.shopDescription')}</p>
        </div>
        <div className="footer-section">
          <h3>{t('footer.contact')}</h3>
          <ul>
            <li>{t('footer.email')}</li>
            <li>{t('footer.phone')}</li>
            <li>{t('footer.address')}</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>{t('footer.followUs')}</h3>
          <div className="social-links">
            <ul>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MeoMeoShop. {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer; 