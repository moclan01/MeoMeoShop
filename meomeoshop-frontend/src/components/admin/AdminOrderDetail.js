import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../service/axiosInstance';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import '../styles/AdminOrders.css';

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      console.log('Fetching order with ID:', id);
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/orders/${id}`);
      console.log('Order data:', response.data);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order:', err.response);
      if (err.response && err.response.status === 404) {
        setError('Đơn hàng không tồn tại.');
      } else {
        setError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrder} />;
  if (!order) return null;

  // Tính tổng tiền tạm tính
  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.quantity * item.pricePerUnit,
    0
  );
  const shippingFee = 0; 
  const total = subtotal + shippingFee;

  return (
    <div className="admin-orders-section">
      <div className="admin-orders-actions">
        <h1>Chi tiết Đơn hàng #{order.orderId}</h1>
        <button onClick={() => navigate('/admin/orders')}>Quay lại</button>
      </div>

      <div className="order-detail">
        <p><strong>Khách hàng:</strong> {order.user.name} ({order.user.email})</p>
        <p><strong>Ngày đặt hàng:</strong> {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod || 'Chưa chọn'}</p>
        <p><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</p>
        <p><strong>Số điện thoại:</strong> {order.phone}</p>

        <h3>Sản phẩm</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item) => (
              <tr key={item.orderItemId}>
                <td>{item.product.name}</td>
                <td>{item.quantity}</td>
                <td>{item.pricePerUnit.toLocaleString('vi-VN')}đ</td>
                <td>{(item.quantity * item.pricePerUnit).toLocaleString('vi-VN')}đ</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="order-total">
          <p><strong>Tạm tính:</strong> {subtotal.toLocaleString('vi-VN')}đ</p>
          <p><strong>Phí giao hàng:</strong> {shippingFee.toLocaleString('vi-VN')}đ</p>
          <p><strong>Tổng cộng:</strong> <span>{total.toLocaleString('vi-VN')}đ</span></p>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;