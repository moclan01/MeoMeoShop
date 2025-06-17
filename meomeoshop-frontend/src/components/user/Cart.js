import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Cart.css';

function Cart({ loggedInUser, updateCartInUserState }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [backendCart, setBackendCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async (onSuccessCallback) => {
    if (!loggedInUser || !loggedInUser.cart || !loggedInUser.cart.cartId) {
      setLoading(false);
      setError(t('cart.loginRequired'));
      setBackendCart(null);
      return;
    }

    const cartId = loggedInUser.cart.cartId;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if(response.status === 404) {
          setBackendCart({ items: [] });
          setLoading(false);
          setError(null);
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
      setError(t('cart.fetchError'));
      setLoading(false);
      setBackendCart(null);
    }
  }, [loggedInUser, t]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, loggedInUser?.cart?.cartId]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`http://localhost:8080/api/cart-items/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating cart item quantity:', errorData);
        alert(t('cart.updateQuantityError'));
        return;
      }

      fetchCart(updateCartInUserState);

    } catch (error) {
      console.error('Error calling update quantity API:', error);
      alert(t('cart.updateQuantityError'));
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart-items/${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Error removing cart item:', response.status);
        alert(t('cart.removeItemError'));
        return;
      }

      fetchCart(updateCartInUserState);

    } catch (error) {
      console.error('Error calling remove item API:', error);
      alert(t('cart.removeItemError'));
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
      alert(t('cart.emptyCartError'));
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return <div className="cart-loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="cart-error">{error}</div>;
  }

  if (itemsToDisplay.length === 0) {
    return (
      <div className="cart-empty">
        <h2>{t('cart.empty')}</h2>
        <Link to="/" className="continue-shopping">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>{t('cart.title')}</h2>
      <div className="cart-content">
        {/* Left Column: Cart Items */}
        <div className="cart-items-list">
          {itemsToDisplay.map(item => (
            <div key={item.cartItemId} className="cart-item">
              <div className="item-image">
                {item.product && item.product.imageUrl ? (
                  <img src={'http://localhost:8080' + item.product.imageUrl} alt={item.product.name} />
                ) : (
                  <img src={require('../../assets/product.png')} alt={item.product.name} />
                )}
              </div>
              <div className="item-details">
                <div className="item-info">
                  <h3>{item.product ? item.product.name : t('cart.unknownProduct')}</h3>
                  <p className="item-price">{item.product ? item.product.price.toLocaleString('vi-VN') + 'đ' : t('common.unavailable')}</p>
                </div>
                <div className="item-actions">
                   <div className="item-quantity-control">
                     <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                     <span>{item.quantity}</span>
                     <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                   </div>
                   <div className="item-total-price">
                     {(item.product ? item.product.price * item.quantity : 0).toLocaleString('vi-VN')}đ
                   </div>
                   <button className="remove-item" onClick={() => removeItem(item.cartItemId)}>
                     ×
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Summary */}
        <div className="cart-summary">
          <h3>{t('cart.total')}</h3>
          <div className="summary-row">
            <span>{t('cart.totalItems')}:</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row total">
            <span>{t('cart.totalPrice')}:</span>
            <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
          </div>
          <button className="checkout-button" onClick={handleCheckoutClick}>{t('cart.order')}</button>
        </div>
      </div>
    </div>
  );
}

export default Cart; 