import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminCategories.css';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../service/axiosInstance';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }



  const handleAddCategory = () => {
    navigate('/categories/add');
  };

  const handleEditCategory = (categoryId) => {
    navigate(`/categories/edit/${categoryId}`);
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
      setError('Không thể xóa danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setCategoryToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const categoryToDeleteName = categories.find(cat => cat.id === categoryToDeleteId)?.name || '';

  if (loading && !categories.length) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  return (
    <div className="admin-categories-section">
      <h1>Quản lý Danh mục</h1>
      <div className="admin-categories-actions">
        <button onClick={handleAddCategory}>Thêm Danh mục Mới</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <button className="edit" onClick={() => handleEditCategory(category.id)}>Sửa</button>
                <button className="delete" onClick={() => handleDeleteClick(category.id)}>Xóa</button>
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