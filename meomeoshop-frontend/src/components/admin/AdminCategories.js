import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminCategories.css';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../service/axiosInstance';
import { useTranslation } from 'react-i18next';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError(t('adminCategories.fetchError'));
    } finally {
      setLoading(false);
    }
  }


  const handleAddCategory = () => {
    navigate('/admin/categories/add');
  };

  const handleEditCategory = (categoryId) => {
    navigate(`/admin/categories/edit/${categoryId}`);
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryToDeleteId(categoryId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/categories/${categoryToDeleteId}`);
      await fetchCategories();
      setCategoryToDeleteId(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(t('adminCategories.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setCategoryToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const categoryToDeleteName = categories.find(cat => cat.categoryId === categoryToDeleteId)?.name || '';

  if (loading && !categories.length) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <div className="admin-categories-section">
      <h1>{t('adminCategories.title')}</h1>
      <div className="admin-categories-actions">
        <button onClick={handleAddCategory}>{t('adminCategories.add')}</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{t('adminCategories.name')}</th>
            <th>{t('adminCategories.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.categoryId}>
              <td>{category.categoryId}</td>
              <td>{category.name}</td>
              <td>
                <button className="edit" onClick={() => {
                  console.log('Edit clicked for categoryId:', category.categoryId);
                  handleEditCategory(category.categoryId)
                }}>{t('adminCategories.edit')}</button>
                <button className="delete" onClick={() => handleDeleteClick(category.categoryId)}>{t('adminCategories.delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={categoryToDeleteName}
      />
    </div>
  );
}

export default AdminCategories; 