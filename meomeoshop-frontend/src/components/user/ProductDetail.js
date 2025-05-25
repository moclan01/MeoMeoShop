import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get route parameters
import '../styles/ProductDetail.css';

function ProductDetail({ loggedInUser, updateCartInUserState }) {
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null); // State to store product details
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Không tìm thấy sản phẩm.');
            setProduct(null);
          } else {
             throw new Error(`Lỗi khi tải sản phẩm: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setProduct(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

  }, [productId]); // Re-run effect when productId changes

  // Hàm xử lý thêm sản phẩm vào giỏ hàng (gọi API)
  const handleAddToCart = async () => { // Modify to call API
    // Kiểm tra xem người dùng đã đăng nhập và có cartId chưa
    if (!loggedInUser || !loggedInUser.cart || !loggedInUser.cart.cartId) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      return;
    }

    const cartId = loggedInUser.cart.cartId;
    const quantity = 1; // Mặc định thêm 1 sản phẩm

    try {
      const response = await fetch(`http://localhost:8080/api/cart-items?cartId=${cartId}&productId=${product.productId}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        console.error('Error adding to cart API response:', errorData);
        let errorMessage = 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ.';
        if(response.status === 400) errorMessage = 'Yêu cầu không hợp lệ.';
        if(response.status === 404) errorMessage = 'Sản phẩm hoặc giỏ hàng không tồn tại.';
        alert(errorMessage + ' Vui lòng thử lại.');
        return;
      }

      alert('Sản phẩm đã được thêm vào giỏ hàng!');
      const cartItemResponse = await response.json();
      console.log('Product added to cart successfully:', cartItemResponse);

      // Fetch the updated cart details after adding an item
      if (loggedInUser?.userId) {
        try {
          const cartResponse = await fetch(`http://localhost:8080/api/carts/by-user/${loggedInUser.userId}`);
          if (cartResponse.ok) {
            const updatedCartData = await cartResponse.json();
            updateCartInUserState(updatedCartData); // Update cart state in App.js
          } else {
            console.error('Failed to fetch updated cart after adding item:', cartResponse.status);
          }
        } catch (error) {
          console.error('Error fetching updated cart after adding item:', error);
        }
      }

    } catch (error) {
      console.error('Error calling add to cart API:', error);
      alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
  };

  if (loading) {
    return <div className="product-detail-container">Đang tải...</div>;
  }

  if (error) {
    return <div className="product-detail-container error">Lỗi: {error}</div>;
  }

  if (!product) {
      return <div className="product-detail-container">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-image">
        <img src={product.imageUrl} alt={product.name} onError={(e) => { e.target.onerror = null; e.target.src="/path/to/placeholder-image.png" }}/>
      </div>
      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p className="price">Giá: {product.price ? product.price.toLocaleString('vi-VN') + 'đ' : 'N/A'}</p>
        {product.categories && product.categories.length > 0 && (
          <p className="category">Danh mục: {product.categories.map(cat => cat.name).join(', ')}</p>
        )}
        <div className="description">
          <h3>Mô tả sản phẩm:</h3>
          <p>{product.description}</p>
        </div>
        {/* Add to cart button */}
        <button className="add-to-cart-button" onClick={handleAddToCart}>Thêm vào giỏ</button>
        {/* Placeholder for reviews/ratings */}
        <div className="reviews">
          <h3>Đánh giá:</h3>
          <p>Chưa có đánh giá nào.</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;