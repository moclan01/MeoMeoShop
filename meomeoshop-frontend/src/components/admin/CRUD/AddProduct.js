import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../service/axiosInstance';

function AddProduct() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    selectedCategories: [],
    base64Image: '',
    fileName: '',
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Lỗi khi tải danh mục.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value));
      }
    }
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
        setFormData((prev) => ({
          ...prev,
          base64Image: base64String,
          fileName: file.name, // Store the original file name
        }));
        setImagePreview(base64String); // Show preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Gửi sản phẩm
      const productRes = await axiosInstance.post('/products', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl
      });

      const productId = productRes.data.productId;

      // 2. Upload the image if selected
      if (formData.base64Image) {
        await axiosInstance.post(`/products/${productId}/image`, {
          base64Image: formData.base64Image,
          fileName: formData.fileName,
        });
      }

      // 3. Gửi từng ProductCategory
      for (const catId of formData.selectedCategories) {
        await axiosInstance.post('/product-categories', {
          product: { productId: productId },
          category: { categoryId: catId }
        });
      }

      // 3. Chuyển trang
      navigate('/admin/products');
    } catch (err) {
      setError('Không thể thêm sản phẩm. Vui lòng kiểm tra lại.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Thêm Sản phẩm mới</h2>
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
        </div>

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
          <div className="form-text">
            Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều danh mục.
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Thêm sản phẩm</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/products')}>
          Hủy
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
