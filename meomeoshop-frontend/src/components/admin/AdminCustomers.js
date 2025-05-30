import React, { useState, useEffect, useCallback } from 'react';

import '../styles/AdminCustomers.css';
import CustomerDetailModal from './CustomerDetailModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import axiosInstance from '../../service/axiosInstance';

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

      const response = await axiosInstance.get('/users');
      setCustomers(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách khách hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleViewCustomer = (userId) => {
    const customer = customers.find(c => c.userId === userId);
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
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.userId}>
              <td>{customer.userId}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone || '—'}</td>
              <td>{customer.address || '—'}</td>
              <td>{customer.role}</td>
              <td>
                <button className="edit" onClick={() => handleViewCustomer(customer.userId)} disabled={loading}>
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
