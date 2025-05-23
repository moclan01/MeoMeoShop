import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminCustomers.css';
import CustomerDetailModal from './CustomerDetailModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockCustomers = [
        { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', phone: '0123456789', address: '123 Đường ABC, Quận XYZ, TP.HCM', orders: [{ id: 101, date: '2024-03-15', total: 430000, status: 'Processing' }, { id: 102, date: '2024-03-10', total: 280000, status: 'Delivered' }] },
        { id: 2, name: 'Trần Thị B', email: 'b@example.com', phone: '0987654321', address: '456 Đường DEF, Quận UVW, TP.HCM', orders: [{ id: 103, date: '2024-03-14', total: 480000, status: 'Shipped' }] }
      ];
      setCustomers(mockCustomers);
    } catch (err) {
      setError('Không thể tải danh sách khách hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleViewCustomer = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  if (loading && !customers.length) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCustomers} />;

  return (
    <div className="admin-customers-section">
      <h1>Quản lý Khách hàng</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Số đơn hàng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.orders?.length || 0}</td>
              <td>
                <button className="edit" onClick={() => handleViewCustomer(customer.id)} disabled={loading}>
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomerDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
}

export default AdminCustomers; 