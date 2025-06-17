import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../service/axiosInstance';

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    selectedCategories: []
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Lỗi khi tải danh mục.');
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/products/${productId}`);
      const product = res.data;

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        selectedCategories: product.categories?.map(c => c.categoryId) || []
      });
    } catch (err) {
      setError('Không thể tải thông tin sản phẩm.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({ ...prev, selectedCategories: selected }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng ảnh
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh (jpg, png, v.v.).');
        return;
      }
      // Kiểm tra kích thước (ví dụ: < 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, base64Image: base64String }));
        setImagePreview(base64String); // Hiển thị preview
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/products/${productId}`, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl
      });

      await axiosInstance.delete(`/product-categories/by-product/${productId}`);

      for (const catId of formData.selectedCategories) {
        await axiosInstance.post('/product-categories', {
          product: { productId: parseInt(productId) },
          category: { categoryId: catId }
        });
      }

      navigate('/admin/products');
    } catch (err) {
      setError('Không thể cập nhật sản phẩm.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Chỉnh sửa sản phẩm</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Giá</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số lượng trong kho</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">URL Hình ảnh</label>
          <input
            type="text"
            className="form-control"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>
        {/* <div className="mb-3">
          <label className="form-label">Hình ảnh</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="img-thumbnail"
                style={{ maxWidth: '200px' }}
              />
            </div>
          )}
        </div> */}

        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            className="form-select"
            multiple
            name="selectedCategories"
            value={formData.selectedCategories}
            onChange={handleCategoryChange}
          >
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/products')}>
          Hủy
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
