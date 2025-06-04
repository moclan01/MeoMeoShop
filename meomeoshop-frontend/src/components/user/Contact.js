import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Contact.css';

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form tại đây (ví dụ: gọi API hoặc gửi email)
    console.log('Form data submitted:', formData);
    alert(t('contactPage.submitSuccess'));
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="contact-page-container">
      <h1>{t('contactPage.title')}</h1>
      
      <div className="contact-info-form">
        <div className="contact-info">
          <h2>{t('contactPage.infoTitle')}</h2>
          <p>{t('contactPage.infoMessage')}</p>
          <ul>
            <li><strong>{t('contactPage.address')}:</strong> 123 Đường ABC, Quận XYZ, TP.HCM</li>
            <li><strong>{t('contactPage.phone')}:</strong> (84) 123-456-789</li>
            <li><strong>{t('contactPage.email')}:</strong> info@meomeoshop.com</li>
          </ul>
          {/* Có thể thêm bản đồ Google Maps tại đây */}
        </div>

        <div className="contact-form">
          <h2>{t('contactPage.formTitle')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('contactPage.name')}:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('auth.email')}:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">{t('contactPage.message')}:</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" className="submit-button">{t('contactPage.submitButton')}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact; 