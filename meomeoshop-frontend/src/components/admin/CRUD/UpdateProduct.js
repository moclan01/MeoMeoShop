import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../service/axiosInstance';
import { useTranslation } from 'react-i18next';

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    base64Image: '',
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
      setError(t('editProduct.fetchCategoryError'));
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/products/${productId}`);
      const product = res.data;

      setFormData(prev => ({
        ...prev,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        selectedCategories: product.categories?.map(c => c.categoryId) || []
      }));

      if (product.imageUrl) {
        setImagePreview('http://localhost:8080' + product.imageUrl);
      }
    } catch (err) {
      setError(t('editProduct.fetchProductError'));
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
      if (!file.type.startsWith('image/')) {
        setError(t('editProduct.imageTypeError'));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(t('editProduct.imageSizeError'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, base64Image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Cập nhật thông tin sản phẩm
      await axiosInstance.put(`/products/${productId}`, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });

      // Nếu có ảnh mới thì upload ảnh riêng
      if (formData.base64Image) {
        await axiosInstance.post(`/products/${productId}/image`, {
          base64Image: formData.base64Image,
          fileName: `product_${productId}`
        });
      }

      // Xóa các danh mục hiện tại
      await axiosInstance.delete(`/product-categories/by-product/${productId}`);

      // Cập nhật danh mục
      if (formData.selectedCategories && formData.selectedCategories.length > 0) {
        for (const catId of formData.selectedCategories) {
          await axiosInstance.post('/product-categories', {
            product: { productId: parseInt(productId) },
            category: { categoryId: catId }
          });
        }
      }

      navigate('/admin/products');
    } catch (err) {
      setError(t('editProduct.updateError'));
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{t('editProduct.title')}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">{t('editProduct.nameLabel')}</label>
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
          <label className="form-label">{t('editProduct.descriptionLabel')}</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">{t('editProduct.priceLabel')}</label>
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
          <label className="form-label">{t('editProduct.stockLabel')}</label>
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
          <label className="form-label">{t('editProduct.imageLabel')}</label>
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
          <label className="form-label">{t('editProduct.categoryLabel')}</label>
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
          <div className="form-text">{t('editProduct.categoryHint')}</div>
        </div>

        <button type="submit" className="btn btn-primary">{t('editProduct.submit')}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/products')}>
          {t('editProduct.cancel')}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
