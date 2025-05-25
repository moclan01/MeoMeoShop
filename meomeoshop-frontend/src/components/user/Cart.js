import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

function Cart({ loggedInUser, updateCartInUserState }) {
  const navigate = useNavigate();

  const [backendCart, setBackendCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define fetchCart outside useEffect and wrap with useCallback
  const fetchCart = useCallback(async (onSuccessCallback) => {
    if (!loggedInUser || !loggedInUser.cart || !loggedInUser.cart.cartId) {
      setLoading(false);
      setError('Vui lòng đăng nhập để xem giỏ hàng.');
      setBackendCart(null);
      return;
    }

    const cartId = loggedInUser.cart.cartId;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/carts/${cartId}`);
      
      if (!response.ok) {
         if(response.status === 404) {
             setBackendCart({ items: [] });
             setLoading(false);
             setError(null); // Clear previous errors if cart is just empty
             return;
         }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBackendCart(data);
      if (onSuccessCallback) {
          onSuccessCallback(data);
      }
      setLoading(false);
      setError(null);

    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
      setLoading(false);
      setBackendCart(null);
    }
  }, [loggedInUser, updateCartInUserState]); // Add dependencies for fetchCart

  useEffect(() => {
    // Fetch cart on component mount or when loggedInUser or cartId changes
    fetchCart();
  }, [fetchCart, loggedInUser?.cart?.cartId]); // Depend on fetchCart and cartId

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
        const response = await fetch(`http://localhost:8080/api/cart-items/${cartItemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: newQuantity }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating cart item quantity:', errorData);
            alert('Cập nhật số lượng thất bại.');
            return;
        }

        // Fetch the updated cart data and update the state via the prop
        fetchCart(updateCartInUserState);

    } catch (error) {
        console.error('Error calling update quantity API:', error);
        alert('Không thể kết nối để cập nhật số lượng.');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/cart-items/${cartItemId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error('Error removing cart item:', response.status);
            alert('Xóa sản phẩm khỏi giỏ hàng thất bại.');
            return;
        }

        // Fetch the updated cart data and update the state via the prop
        fetchCart(updateCartInUserState);

    } catch (error) {
        console.error('Error calling remove item API:', error);
        alert('Không thể kết nối để xóa sản phẩm.');
    }
  };

  const itemsToDisplay = backendCart && backendCart.items ? backendCart.items : [];

  const totalItems = itemsToDisplay.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = itemsToDisplay.reduce((sum, item) => {
    const itemPrice = (item.product && item.product.price) ? item.product.price : 0;
    const itemQuantity = item.quantity ? item.quantity : 0;
    return sum + itemPrice * itemQuantity;
  }, 0);

  const handleCheckoutClick = () => {
    if (!backendCart || !backendCart.items || backendCart.items.length === 0) {
        alert('Giỏ hàng trống, không thể thanh toán.');
        return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Giỏ hàng</h1>
        {loading && <p>Đang tải giỏ hàng...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && itemsToDisplay.length === 0 ? (
          <div className="empty-cart">
            <p>Giỏ hàng của bạn đang trống</p>
            <Link to="/" className="continue-shopping">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : !loading && !error && (
          <div className="cart-content">
            <div className="cart-items">
              {itemsToDisplay.map(item => (
                <div key={item.cartItemId} className="cart-item">
                  <div className="item-image">
                    {item.product && item.product.imageUrl ? (
                       <img src={item.product.imageUrl} alt={item.product.name} />
                    ) : (
                       <img src={require('../../assets/product.png')} alt={item.product.name} />
                    )}
                  </div>
                  <div className="item-info">
                    <h3>{item.product ? item.product.name : 'Sản phẩm không rõ tên'}</h3>
                    <p className="item-price">{item.product ? item.product.price.toLocaleString('vi-VN') + 'đ' : 'N/A'}</p>
                  </div>
                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                  </div>
                  <div className="item-total">
                    {(item.product ? item.product.price * item.quantity : 0).toLocaleString('vi-VN')}đ
                  </div>
                  <button className="remove-item" onClick={() => removeItem(item.cartItemId)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Tổng cộng</h2>
              <div className="summary-row">
                <span>Số lượng sản phẩm:</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-row total">
                <span>Tổng tiền:</span>
                <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <button className="checkout-button" onClick={handleCheckoutClick}>Thanh toán</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart; 