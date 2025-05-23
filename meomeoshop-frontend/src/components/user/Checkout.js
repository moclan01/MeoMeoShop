import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

function Checkout({ cartItems, setCartItems }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Calculate total price from cart items (ensure price is numeric)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle order submission logic here
    console.log('Submitting order with data:', formData);
    console.log('Cart items:', cartItems);
    // You will need to integrate with your backend API to process the order

    // After successful order submission:
    // Clear the cart
    // setCartItems([]);
    // Optionally, redirect to an order confirmation page
    // navigate('/order-confirmation');
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>Thanh toán</h1>
          <div className="empty-cart">
            <p>Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.</p>
            <Link to="/" className="continue-shopping">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Thanh toán</h1>
        <div className="checkout-content">
          <div className="checkout-forms">
            <h2>Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Họ và tên:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại:</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ giao hàng:</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="notes">Ghi chú (tùy chọn):</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange}></textarea>
              </div>
              {/* Payment method selection can be added here */}
            </form>
          </div>
          <div className="order-summary">
            <h2>Đơn hàng của bạn</h2>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Tổng cộng:</span>
              <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            <button type="submit" className="place-order-button" form="checkout-form">Đặt hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout; 