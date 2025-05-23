import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Meo Meo Shop</h3>
          <p>Chuyên cung cấp các sản phẩm chất lượng cho thú cưng của bạn</p>
        </div>
        <div className="footer-section">
          <h3>Liên hệ</h3>
          <p>Email: info@meomeoshop.com</p>
          <p>Điện thoại: (84) 123-456-789</p>
          <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
        </div>
        <div className="footer-section">
          <h3>Theo dõi chúng tôi</h3>
          <p>Facebook</p>
          <p>Instagram</p>
          <p>Twitter</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Meo Meo Shop. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer; 