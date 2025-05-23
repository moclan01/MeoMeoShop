import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminProducts.css';
import ProductModal from './ProductModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call for products
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockProducts = [
        { id: 1, name: 'Product A', price: 100000, category: 'Electronics', description: 'Description A', stock: 10 },
        { id: 2, name: 'Product B', price: 200000, category: 'Books', description: 'Description B', stock: 20 },
      ];
      setProducts(mockProducts);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      // Simulate API call for categories
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockCategories = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Books' },
        { id: 3, name: 'Clothing' },
      ];
      setCategories(mockCategories);
    } catch (err) {
      // Handle category fetch error separately if needed, or combine
      console.error('Error fetching categories:', err);
      // Optionally set error state for categories if critical
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (productId) => {
    setProductToDeleteId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(products.filter(p => p.id !== productToDeleteId));
      setProductToDeleteId(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setProductToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const handleSubmitProduct = async (formData) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      if (selectedProduct) {
        setProducts(products.map(p => 
          p.id === selectedProduct.id ? { ...p, ...formData } : p
        ));
      } else {
        const newProduct = {
          id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
          ...formData
        };
        setProducts([...products, newProduct]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Không thể lưu sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const productToDeleteName = products.find(p => p.id === productToDeleteId)?.name || '';

  if (error && !products.length) return <ErrorMessage message={error} onRetry={fetchProducts} />;

  return (
    <div className="admin-products-section">
      <h1>Quản lý Sản phẩm</h1>
      {loading && products.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="admin-products-actions">
            <button onClick={handleAddProduct} disabled={loading}>Thêm Sản phẩm Mới</button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Danh mục</th>
                <th>Số lượng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString('vi-VN')}đ</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button className="edit" onClick={() => handleEditProduct(product.id)} disabled={loading}>Sửa</button>
                    <button className="delete" onClick={() => handleDeleteClick(product.id)} disabled={loading}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleSubmitProduct}
        categories={categories}
      />

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