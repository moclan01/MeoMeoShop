import React, { useState, useEffect } from 'react';
import { Link,useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Orders.css';

function OrderDetail({ loggedInUser }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!loggedInUser) {
        setLoading(false);
        setError(t('orders.errorNotLoggedIn'));
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error(t('orders.errorFetchOrderDetails'));
        }
        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (error) {
        setError(t('orders.errorFetchOrderDetails'));
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, loggedInUser, t]);

  if (loading) return <div className="loading">{t('orders.loading')}</div>;
  if (error) return <div className="error">{error}</div>;
  if (!loggedInUser) {
    return (
      <div className="not-logged-in">
        <h2>{t('orders.errorNotLoggedIn')}</h2>
        <Link to="/login" className="login-button">{t('orders.login')}</Link>
      </div>
    );
  }

  if (!order) {
    return <div className="error">{t('orders.orderNotFound')}</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>{t('orders.orderDetails')} #{order.orderId}</h1>
        <div className="order-card">
          <div className="order-header">
            <div className="order-info">
              <p><strong>{t('orders.orderDate')}:</strong> {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
              <p><strong>{t('orders.status')}:</strong> {order.status}</p>
              <p><strong>{t('orders.totalAmount')}:</strong> {order.totalAmount.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>

          <div className="order-items">
            <h3>{t('orders.items')}</h3>
            {order.orderItems.map(item => (
              <div key={item.orderItemId} className="order-item">
                <img
                  src={'http://localhost:8080' + item.product.imageUrl || require('../../assets/product.png')}
                  alt={item.product.name}
                />
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p>{t('orders.quantity')}: {item.quantity}</p>
                  <p className="price">
                    {item.pricePerUnit.toLocaleString('vi-VN')}đ x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <div className="shipping-info">
              <p><strong>{t('orders.shippingAddress')}:</strong> {order.shippingAddress || t('orders.notProvided')}</p>
              <p><strong>{t('orders.phone')}:</strong> {order.phone || t('orders.notProvided')}</p>
            </div>
            <button
              className="back-button"
              onClick={() => navigate('/user/orders')}
            >
              {t('orders.backToList')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;