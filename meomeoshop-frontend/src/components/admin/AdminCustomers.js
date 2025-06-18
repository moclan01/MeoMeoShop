import React, { useState, useEffect, useCallback } from 'react';

import '../styles/AdminCustomers.css';
import CustomerDetailModal from './CustomerDetailModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import axiosInstance from '../../service/axiosInstance';
import { useTranslation } from 'react-i18next';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const { t } = useTranslation();

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/users');
      setCustomers(response.data || []);
    } catch (err) {
      console.error(err);
      setError(t('adminCustomers.fetchError'));
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

  const handleDeleteCustomer = async (userId) => {
    if (!window.confirm(t('adminCustomers.confirmDelete'))) return; 

    try {
      setLoading(true);
      await axiosInstance.delete(`/users/${userId}`);
      setCustomers(prev => prev.filter(c => c.userId !== userId)); // cập nhật danh sách sau khi xóa
    } catch (err) {
      console.error(err);
     setError(t('adminCustomers.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !customers.length) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCustomers} />;

  return (
    <div className="admin-customers-section">
      <h1>{t('adminCustomers.title')}</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('adminCustomers.id')}</th>
            <th>{t('adminCustomers.name')}</th>
            <th>{t('adminCustomers.email')}</th>
            <th>{t('adminCustomers.phone')}</th>
            <th>{t('adminCustomers.address')}</th>
            <th>{t('adminCustomers.role')}</th>
            <th>{t('adminCustomers.actions')}</th>
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
                  {t('adminCustomers.view')}
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteCustomer(customer.userId)}
                  disabled={loading}
                  style={{ marginLeft: '8px' }}
                >
                  {t('adminCustomers.delete')}
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
