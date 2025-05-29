import React, { useState, useEffect } from 'react';
import '../styles/AdminProducts.css';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import axiosInstance from '../../service/axiosInstance';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
      console.log(response.data);
      setError(null);
    } catch (err) {
      setError('Lỗi khi tải sản phẩm.');
      setProducts([]);
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDeleteId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/products/${productToDeleteId}`);
      setIsDeleteModalOpen(false);
      setProductToDeleteId(null);
      fetchProducts();
    } catch (err) {
      setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setProductToDeleteId(null);
  };

  const productToDeleteName = products.find(p => p.productId === productToDeleteId)?.name || '';
  console.log('Render products:', products);
  return (
    <div className="admin-products-section">
      <h1>Quản lý Sản phẩm</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                Chưa có sản phẩm nào
              </td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>
                  {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover' }} />
                    : 'No Image'}
                </td>
                <td>{product.name}</td>
                <td>{product.price !== undefined && product.price !== null
                  ? product.price.toLocaleString('vi-VN') + 'đ'
                  : 'Chưa có giá'}
                </td>
                <td>
                  {product.categories && product.categories.length > 0
                    ? product.categories.map(cat => cat.name).join(', ')
                    : 'Không có danh mục'}
                </td>
                <td>{product.stock !== undefined && product.stock !== null ? product.stock : 'N/A'}</td>
                <td>
                  <button
                    className="delete"
                    onClick={() => handleDeleteClick(product.productId)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={productToDeleteName}
      />
    </div>
  );
}

export default AdminProducts;
