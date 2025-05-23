import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminCategories.css';
import CategoryModal from './CategoryModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockCategories = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Books' },
        { id: 3, name: 'Clothing' },
      ];
      setCategories(mockCategories);
    } catch (err) {
      setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryToDeleteId(categoryId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCategories(categories.filter(c => c.id !== categoryToDeleteId));
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

  const handleSubmitCategory = async (formData) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      if (selectedCategory) {
        setCategories(categories.map(c => 
          c.id === selectedCategory.id ? { ...c, ...formData } : c
        ));
      } else {
        const newCategory = {
          id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
          ...formData
        };
        setCategories([...categories, newCategory]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Không thể lưu danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSubmit={handleSubmitCategory}
      />

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