import React from 'react';
import '../styles/AdminCustomers.css';

function CustomerDetailModal({ isOpen, onClose, customer }) {
  if (!isOpen || !customer) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Thông tin Khách hàng</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="customer-detail">
          <div className="customer-info">
            <h3>Thông tin cá nhân</h3>
            <p><strong>ID:</strong> {customer.id}</p>
            <p><strong>Họ tên:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Số điện thoại:</strong> {customer.phone}</p>
            <p><strong>Địa chỉ:</strong> {customer.address}</p>
          </div>

          <div className="customer-orders">
            <h3>Lịch sử đơn hàng</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders?.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.total.toLocaleString('vi-VN')}đ</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailModal; 