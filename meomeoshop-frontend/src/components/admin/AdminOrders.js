import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminOrders.css';
import OrderDetailModal from './OrderDetailModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockOrders = [
        { id: 101, customer: 'Nguyễn Văn A', orderDate: '2024-03-15', status: 'Processing', shippingAddress: '123 Đường ABC, Quận XYZ, TP.HCM', paymentMethod: 'Chuyển khoản', items: [{ name: 'Product A', quantity: 2, price: 100000 }, { name: 'Product B', quantity: 1, price: 200000 }], subtotal: 400000, shippingFee: 30000, total: 430000 },
        { id: 102, customer: 'Trần Thị B', orderDate: '2024-03-14', status: 'Shipped', shippingAddress: '456 Đường DEF, Quận UVW, TP.HCM', paymentMethod: 'Tiền mặt', items: [{ name: 'Product C', quantity: 3, price: 150000 }], subtotal: 450000, shippingFee: 30000, total: 480000 }
      ];
      setOrders(mockOrders);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading && !orders.length) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOrders} />;

  return (
    <div className="admin-orders-section">
      <h1>Quản lý Đơn hàng</h1>
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
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.orderDate}</td>
              <td>{order.total.toLocaleString('vi-VN')}đ</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="order-status-select"
                >
                  <option value="Processing">Đang xử lý</option>
                  <option value="Shipped">Đã gửi hàng</option>
                  <option value="Delivered">Đã giao hàng</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </td>
              <td>
                <button className="edit" onClick={() => handleViewOrder(order.id)} disabled={loading}>
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

export default AdminOrders; 