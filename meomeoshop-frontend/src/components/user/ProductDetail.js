import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // To get route parameters
import { useTranslation } from 'react-i18next';
import '../styles/ProductDetail.css';

const ProductDetail = ({ loggedInUser, updateCartInUserState }) => {
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null); // State to store product details
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setError(t('product.notFound'));
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError(t('product.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, t]); // Re-run effect when productId changes

  // Hàm xử lý thêm sản phẩm vào giỏ hàng (gọi API)
  const handleAddToCart = async () => {
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    const cartId = loggedInUser.cart.cartId;
    const userId = loggedInUser.userId;
    try {
      // Gửi request thêm sản phẩm vào giỏ hàng
      const addResponse = await fetch(
        `http://localhost:8080/api/cart-items?cartId=${cartId}&productId=${productId}&quantity=${quantity}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!addResponse.ok) {
        const errorText = await addResponse.text();
        console.error('Add to cart failed response:', addResponse.status, errorText);
        throw new Error(t('product.addToCartError'));
      }

      // Fetch lại toàn bộ thông tin giỏ hàng của user
      const fetchCartResponse = await fetch(`http://localhost:8080/api/carts/by-user/${userId}`, {
        credentials: 'include',
      });

      if (!fetchCartResponse.ok) {
        const errorText = await fetchCartResponse.text();
        console.error('Failed to refetch cart after adding item:', fetchCartResponse.status, errorText);
        throw new Error(t('cart.fetchError'));
      }

      const updatedCartData = await fetchCartResponse.json();
      updateCartInUserState(updatedCartData);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(t('product.addToCartError'));
    }
  };

  if (loading) {
    return <div className="product-loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="product-error">{error}</div>;
  }

  if (!product) {
    return <div className="product-not-found">{t('product.notFound')}</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-image">
        <img src={'http://localhost:8080' + product.imageUrl} alt={product.name} onError={(e) => { e.target.onerror = null; e.target.src = "/path/to/placeholder-image.png" }} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="product-price">{t('product.price')}: {product.price ? product.price.toLocaleString('vi-VN') + 'đ' : 'N/A'}</p>
        {product.categories && product.categories.length > 0 && (
          <p className="product-category">Danh mục: {product.categories.map(cat => cat.name).join(', ')}</p>
        )}
        <div className="product-description">
          <h3>{t('product.description')}:</h3>
          <p>{product.description}</p>
        </div>
        <div className="quantity-selector">
          <label htmlFor="quantity">{t('product.quantity')}:</label>
          <div className="quantity-controls">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>
        <div className="product-actions">
          <button className="add-to-cart" onClick={handleAddToCart}>
            {t('product.addToCart')}
          </button>
          <button className="buy-now" onClick={() => navigate('/checkout')}>
            {t('product.buyNow')}
          </button>
        </div>
        {/* Placeholder for reviews/ratings */}
        <div className="reviews">
          <h3>{t('product.reviews')}:</h3>
          <p>{t('product.noReviews')}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;