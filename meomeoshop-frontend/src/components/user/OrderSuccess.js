import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/OrderSuccess.css';

function OrderSuccess() {
  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Đặt hàng thành công!</h1>
        <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
        <div className="success-actions">
          <Link to="/" className="continue-shopping">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess; 