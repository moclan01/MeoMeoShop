import React from 'react';
import '../styles/OrderDetailModal.css';

function OrderDetailModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Chi tiết Đơn hàng #{order.id}</h2>
        <div className="order-info">
          <p><strong>Khách hàng:</strong> {order.customer}</p>
          <p><strong>Ngày đặt hàng:</strong> {order.orderDate}</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          <p><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</p>
        </div>
        <h3>Sản phẩm</h3>
        <table className="order-items">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString('vi-VN')}đ</td>
                <td>{(item.quantity * item.price).toLocaleString('vi-VN')}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-summary">
          <p><strong>Tạm tính:</strong> {order.subtotal.toLocaleString('vi-VN')}đ</p>
          <p><strong>Phí giao hàng:</strong> {order.shippingFee.toLocaleString('vi-VN')}đ</p>
          <p><strong>Tổng cộng:</strong> <span className="total">{order.total.toLocaleString('vi-VN')}đ</span></p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
