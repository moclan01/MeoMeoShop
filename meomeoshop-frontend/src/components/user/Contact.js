import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
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
    alert('Tin nhắn của bạn đã được gửi!');
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="contact-page-container">
      <h1>Liên Hệ Với Chúng Tôi</h1>
      
      <div className="contact-info-form">
        <div className="contact-info">
          <h2>Thông Tin Liên Hệ</h2>
          <p>Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào, vui lòng liên hệ với chúng tôi qua thông tin dưới đây hoặc điền vào biểu mẫu.</p>
          <ul>
            <li><strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP.HCM</li>
            <li><strong>Điện thoại:</strong> (84) 123-456-789</li>
            <li><strong>Email:</strong> info@meomeoshop.com</li>
          </ul>
          {/* Có thể thêm bản đồ Google Maps tại đây */}
        </div>

        <div className="contact-form">
          <h2>Gửi Tin Nhắn</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Họ và Tên:</label>
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
              <label htmlFor="email">Email:</label>
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
              <label htmlFor="message">Tin Nhắn:</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" className="submit-button">Gửi Tin Nhắn</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact; 