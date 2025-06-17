import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminOrders.css';
import OrderDetailModal from './OrderDetailModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import axiosInstance from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleAddOrder = () => {
    navigate('/admin/orders/add');
  };

  const handleEditOrder = (orderId) => {
    navigate(`/admin/orders/edit/${orderId}`);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/orders/${orderId}`);
      setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
    } catch (err) {
      setError('Không thể xóa đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/detail/${orderId}`);
  };

  if (loading && !orders.length) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrders} />;

  return (
    <div className="admin-orders-section">
      <h1>Quản lý Đơn hàng</h1>
      <div className="admin-orders-actions">
        <button className="btn btn-primary" onClick={handleAddOrder} disabled={loading}>
          Thêm Đơn hàng Mới
        </button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID Đơn hàng</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.user.name}</td>
              <td>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
              <td>{order.totalAmount.toLocaleString('vi-VN')}đ</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-1"
                  onClick={() => handleViewOrder(order.orderId)}
                  disabled={loading}
                >
                  Chi tiết
                </button>
                <button
                  className="btn btn-warning btn-sm me-1"
                  onClick={() => handleEditOrder(order.orderId)}
                  disabled={loading}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteOrder(order.orderId)}
                  disabled={loading}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminOrders;
