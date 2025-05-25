import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Orders.css';

function Orders({ loggedInUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!loggedInUser) {
        setLoading(false);
        setError('Vui lòng đăng nhập để xem đơn hàng.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/orders/by-user/${loggedInUser.userId}`);
        if (!response.ok) {
          throw new Error('Không thể tải thông tin đơn hàng');
        }
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        setError('Có lỗi xảy ra khi tải thông tin đơn hàng');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [loggedInUser]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!loggedInUser) {
    return (
      <div className="not-logged-in">
        <h2>Vui lòng đăng nhập để xem đơn hàng</h2>
        <Link to="/login" className="login-button">Đăng nhập</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>Đơn hàng của tôi</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Bạn chưa có đơn hàng nào</p>
            <Link to="/" className="continue-shopping">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Đơn hàng #{order.orderId}</h3>
                    <p className="order-date">Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                    <p className="order-status">Trạng thái: {order.status}</p>
                  </div>
                  <div className="order-total">
                    Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')}đ
                  </div>
                </div>
                
                <div className="order-items">
                  {order.orderItems.map(item => (
                    <div key={item.orderItemId} className="order-item">
                      <img 
                        src={item.product.imageUrl || require('../../assets/product.png')} 
                        alt={item.product.name} 
                      />
                      <div className="item-details">
                        <h4>{item.product.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                        <p className="price">
                          {item.pricePerUnit.toLocaleString('vi-VN')}đ x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="shipping-info">
                    <p><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</p>
                    <p><strong>Số điện thoại:</strong> {order.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders; 