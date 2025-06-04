import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Order.css';

function Order({ loggedInUser, updateCartInUserState }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderInfo, setOrderInfo] = useState({
    shippingAddress: '',
    phone: '',
    note: ''
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!loggedInUser || !loggedInUser.cart || !loggedInUser.cart.cartId) {
        setLoading(false);
        setError(t('checkout.loginRequired'));
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/carts/${loggedInUser.cart.cartId}`);
        if (!response.ok) {
          throw new Error(t('checkout.error'));
        }
        const data = await response.json();
        setCartItems(data.items || []);
        setLoading(false);
      } catch (error) {
        setError(t('checkout.error'));
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [loggedInUser, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderInfo.shippingAddress || !orderInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    try {
      // Create order
      const orderResponse = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            userId: loggedInUser.userId,
          },
          orderDate: new Date().toISOString().split('T')[0],
          totalAmount: calculateTotal(),
          status: 'PENDING',
          shippingAddress: orderInfo.shippingAddress,
          phone: orderInfo.phone,
          orderItems: cartItems.map(item => ({
            quantity: item.quantity,
            pricePerUnit: item.product.price,
            product: {
              productId: item.product.productId,
              name: item.product.name,
              imageUrl: item.product.imageUrl,
              price: item.product.price,
            }
          }))
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Không thể tạo đơn hàng');
      }

      const orderData = await orderResponse.json();
      
      // Clear cart after successful order
      const clearCartResponse = await fetch(`http://localhost:8080/api/carts/${loggedInUser.cart.cartId}/clear`, {
        method: 'POST'
      });

      if (!clearCartResponse.ok) {
        console.error('Không thể xóa giỏ hàng sau khi đặt hàng');
      }

      // Update cart state in the parent component (App.js)
      updateCartInUserState({ ...loggedInUser.cart, items: [] });

      navigate('/order-success');
    } catch (error) {
      alert(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
    }
  };

  if (loading) return <div className="loading">{t('checkout.loading')}</div>;
  if (error) return <div className="error">{error}</div>;
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>{t('checkout.emptyCart')}</h2>
        <button onClick={() => navigate('/')}>{t('checkout.continueShopping')}</button>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-container">
        <h1>{t('checkout.shippingInfo')}</h1>
        
        <div className="order-content">
          <div className="order-form">
            <h2>{t('checkout.shippingInfo')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="shippingAddress">{t('checkout.shippingAddress')}:</label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={orderInfo.shippingAddress}
                  onChange={handleInputChange}
                  required
                  placeholder={t('checkout.shippingAddress')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t('checkout.phone')}:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={orderInfo.phone}
                  onChange={handleInputChange}
                  required
                  placeholder={t('checkout.phone')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="note">{t('checkout.notes')}:</label>
                <textarea
                  id="note"
                  name="note"
                  value={orderInfo.note}
                  onChange={handleInputChange}
                  placeholder={t('checkout.notes')}
                />
              </div>

              <button type="submit" className="submit-order">
                {t('checkout.placeOrder')}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h2>{t('checkout.yourOrder')}</h2>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.cartItemId} className="order-item">
                  <img 
                    src={item.product.imageUrl || require('../../assets/product.png')} 
                    alt={item.product.name} 
                  />
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p>{t('product.quantity')}: {item.quantity}</p>
                    <p className="price">
                      {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-total">
              <h3>{t('checkout.total')}:</h3>
              <p className="total-amount">
                {calculateTotal().toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order; 