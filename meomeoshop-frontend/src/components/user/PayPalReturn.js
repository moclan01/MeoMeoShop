import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/PayPalReturn.css'; // Bạn sẽ cần tạo file CSS này

function PayPalReturn({ loggedInUser, updateCartInUserState }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [paymentStatus, setPaymentStatus] = useState('pending'); // success, failed, error
  const [message, setMessage] = useState('Đang xác nhận thanh toán PayPal...');

  useEffect(() => {
    const executePayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      const orderId = queryParams.get('token');
      const payerId = queryParams.get('PayerID');

      if (orderId && payerId) {
        try {
          const response = await fetch('http://localhost:8080/api/paypal/execute-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, payerId }),
          });

          if (!response.ok) {
            throw new Error(t('paypalReturn.errorExecuting'));
          }

          const data = await response.json();
          if (data.status === 'success') {
            setMessage(t('paypalReturn.success'));
            setPaymentStatus('success');

            // Clear cart after successful PayPal payment
            if (loggedInUser && loggedInUser.cart && loggedInUser.cart.cartId) {
              const clearCartResponse = await fetch(`http://localhost:8080/api/carts/${loggedInUser.cart.cartId}/clear`, {
                method: 'POST'
              });

              if (!clearCartResponse.ok) {
                console.error('Không thể xóa giỏ hàng sau khi đặt hàng PayPal');
              } else {
                console.log('Giỏ hàng đã được xóa sau thanh toán PayPal thành công.');
                updateCartInUserState({ ...loggedInUser.cart, items: [] }); // Update cart state in parent
              }
            }

            // navigate('/order-success'); // You might want to redirect to a generic success page
          } else {
            setMessage(t('paypalReturn.failed') + ': ' + data.message);
            setPaymentStatus('failed');
          }
        } catch (error) {
          setMessage(t('paypalReturn.error') + ': ' + error.message);
          setPaymentStatus('error');
        }
      } else {
        setMessage(t('paypalReturn.invalidParams'));
        setPaymentStatus('error');
      }
    };

    executePayment();
  }, [location.search, t, navigate, loggedInUser, updateCartInUserState]);

  return (
    <div className="paypal-return-page">
      <div className={`paypal-return-container ${paymentStatus}`}>
        {paymentStatus === 'success' && (
          <i className="fas fa-check-circle success-icon"></i>
        )}
        {paymentStatus === 'failed' && (
          <i className="fas fa-times-circle failed-icon"></i>
        )}
        {paymentStatus === 'pending' && (
          <i className="fas fa-spinner fa-spin pending-icon"></i>
        )}
        {paymentStatus === 'error' && (
          <i className="fas fa-exclamation-triangle error-icon"></i>
        )}
        <h2>{t('paypalReturn.title')}</h2>
        <p>{message}</p>
        <button onClick={() => navigate('/')}>{t('paypalReturn.continueShopping')}</button>
      </div>
    </div>
  );
}

export default PayPalReturn; 