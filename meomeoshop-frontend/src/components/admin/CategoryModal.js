import React, { useState, useEffect } from 'react';
import '../styles/AdminCategories.css';

function CategoryModal({ isOpen, onClose, category, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{category ? 'Sửa Danh mục' : 'Thêm Danh mục Mới'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Tên danh mục:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {category ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal; 