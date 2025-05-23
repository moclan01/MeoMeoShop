import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate();

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Giỏ hàng</h1>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Giỏ hàng của bạn đang trống</p>
            <Link to="/" className="continue-shopping">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={require(`../../assets/${item.image}`)} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-price">{item.price.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="item-total">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                  <button className="remove-item" onClick={() => removeItem(item.id)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Tổng cộng</h2>
              <div className="summary-row">
                <span>Số lượng sản phẩm:</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-row total">
                <span>Tổng tiền:</span>
                <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <button className="checkout-button" onClick={handleCheckoutClick}>Thanh toán</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart; 