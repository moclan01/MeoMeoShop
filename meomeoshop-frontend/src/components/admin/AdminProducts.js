import React, { useState, useEffect } from 'react';
import '../styles/AdminProducts.css';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import axiosInstance from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);
  const navigate = useNavigate()
  const { t } = useTranslation();

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
      setError(t('adminProducts.fetchError'));
      setProducts([]);
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDeleteId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/products/${productToDeleteId}`);
      setIsDeleteModalOpen(false);
      setProductToDeleteId(null);
      fetchProducts();
    } catch (err) {
      setError(t('adminProducts.deleteError'));
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setProductToDeleteId(null);
  };

  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  }

  const productToDeleteName = products.find(p => p.productId === productToDeleteId)?.name || '';
  console.log('Render products:', products);

  // return (
  //   <div className="admin-products-section">
  //     <h1>Quản lý Sản phẩm</h1>
  //     <div className="admin-product-actions">
  //       <button className="btn btn-primary" onClick={handleAddProduct}>Thêm sản phẩm Mới</button>
  //     </div>
  //     {error && <p style={{ color: 'red' }}>{error}</p>}

  //     <table className="admin-table">
  //       <thead>
  //         <tr>
  //           <th>ID</th>
  //           <th>Hình ảnh</th>
  //           <th>Tên sản phẩm</th>
  //           <th>Giá</th>
  //           <th>Danh mục</th>
  //           <th>Số lượng</th>
  //           <th>Hành động</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {products.length === 0 ? (
  //           <tr>
  //             <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
  //               Chưa có sản phẩm nào
  //             </td>
  //           </tr>
  //         ) : (
  //           products.map(product => (
  //             <tr key={product.productId}>
  //               <td>{product.productId}</td>
  //               <td>
  //                 {product.imageUrl
  //                   ? <img src={'http://localhost:8080' + product.imageUrl} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover' }} />
  //                   : 'No Image'}
  //               </td>
  //               <td>{product.name}</td>
  //               <td>{product.price !== undefined && product.price !== null
  //                 ? product.price.toLocaleString('vi-VN') + 'đ'
  //                 : 'Chưa có giá'}
  //               </td>
  //               <td>
  //                 {product.categories && product.categories.length > 0
  //                   ? product.categories.map(cat => cat.name).join(', ')
  //                   : 'Không có danh mục'}
  //               </td>
  //               <td>{product.stock !== undefined && product.stock !== null ? product.stock : 'N/A'}</td>
  //               <td>
  //                 <button
  //                   className="edit"
  //                   onClick={() => handleEditProduct(product.productId)}
  //                   style={{ marginRight: 8 }}
  //                 >
  //                   Sửa
  //                 </button>
  //                 <button
  //                   className="delete"
  //                   onClick={() => handleDeleteClick(product.productId)}
  //                 >
  //                   Xóa
  //                 </button>
  //               </td>
  //             </tr>
  //           ))
  //         )}
  //       </tbody>
  //     </table>

  //     <DeleteConfirmModal
  //       isOpen={isDeleteModalOpen}
  //       onClose={handleDeleteCancel}
  //       onConfirm={handleDeleteConfirm}
  //       itemName={productToDeleteName}
  //     />
  //   </div>
  // );
  return (
    <div className="admin-products-section">
      <h1>{t('adminProducts.title')}</h1>
      <div className="admin-product-actions">
        <button className="btn btn-primary" onClick={handleAddProduct}>
          {t('adminProducts.add')}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{t('adminProducts.image')}</th>
            <th>{t('adminProducts.name')}</th>
            <th>{t('adminProducts.price')}</th>
            <th>{t('adminProducts.category')}</th>
            <th>{t('adminProducts.stock')}</th>
            <th>{t('adminProducts.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                {t('adminProducts.empty')}
              </td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>
                  {product.imageUrl ? (
                    <img
                      src={'http://localhost:8080' + product.imageUrl}
                      alt={product.name}
                      style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                  ) : (
                    t('adminProducts.noImage')
                  )}
                </td>
                <td>{product.name}</td>
                <td>
                  {product.price !== undefined && product.price !== null
                    ? product.price.toLocaleString('vi-VN') + 'đ'
                    : t('adminProducts.noPrice')}
                </td>
                <td>
                  {product.categories && product.categories.length > 0
                    ? product.categories.map(cat => cat.name).join(', ')
                    : t('adminProducts.noCategory')}
                </td>
                <td>{product.stock !== undefined && product.stock !== null ? product.stock : 'N/A'}</td>
                <td>
                  <button
                    className="edit"
                    onClick={() => handleEditProduct(product.productId)}
                    style={{ marginRight: 8 }}
                  >
                    {t('adminProducts.edit')}
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDeleteClick(product.productId)}
                  >
                    {t('adminProducts.delete')}
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
