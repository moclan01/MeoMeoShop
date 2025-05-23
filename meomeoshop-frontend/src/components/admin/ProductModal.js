import React, { useState, useEffect } from 'react';
import '../styles/AdminProducts.css';

function ProductModal({ isOpen, onClose, product, onSubmit, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || (categories.length > 0 ? categories[0].name : ''),
        description: product.description || '',
        image: product.image || '',
        stock: product.stock || ''
      });
    } else {
      setFormData(prev => ({
        ...prev,
        category: categories.length > 0 ? categories[0].name : ''
      }));
    }
  }, [product, categories]);

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
          <h2>{product ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Tên sản phẩm:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Danh mục:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">URL Hình ảnh:</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Số lượng tồn kho:</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {product ? 'Cập nhật' : 'Thêm mới'}
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

export default ProductModal; 