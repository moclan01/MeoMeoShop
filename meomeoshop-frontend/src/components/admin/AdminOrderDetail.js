import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../service/axiosInstance';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import '../styles/AdminOrders.css';
import { useTranslation } from 'react-i18next';

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

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
        setError(t('adminOrderDetail.notFound'));
      } else {
        setError(t('adminOrderDetail.fetchError'));
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
        <h1>{t('adminOrderDetail.title')} #{order.orderId}</h1>
        <button onClick={() => navigate('/admin/orders')}>{t('adminOrderDetail.back')}</button>
      </div>

      <div className="order-detail">
        <p><strong>{t('adminOrderDetail.customer')}:</strong> {order.user.name} ({order.user.email})</p>
        <p><strong>{t('adminOrderDetail.orderDate')}:</strong> {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
        <p><strong>{t('adminOrderDetail.status')}:</strong> {order.status}</p>
        <p><strong>{t('adminOrderDetail.paymentMethod')}:</strong> {order.paymentMethod || t('adminOrderDetail.notSelected')}</p>
        <p><strong>{t('adminOrderDetail.shippingAddress')}:</strong> {order.shippingAddress}</p>
        <p><strong>{t('adminOrderDetail.phone')}:</strong> {order.phone}</p>

        <h3>Sản phẩm</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('adminOrderDetail.product')}</th>
              <th>{t('adminOrderDetail.quantity')}</th>
              <th>{t('adminOrderDetail.price')}</th>
              <th>{t('adminOrderDetail.total')}</th>
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
          <p><strong>{t('adminOrderDetail.subtotal')}:</strong> {subtotal.toLocaleString('vi-VN')}đ</p>
          <p><strong>{t('adminOrderDetail.shippingFee')}:</strong> {shippingFee.toLocaleString('vi-VN')}đ</p>
          <p><strong>{t('adminOrderDetail.grandTotal')}:</strong> <span>{total.toLocaleString('vi-VN')}đ</span></p>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;