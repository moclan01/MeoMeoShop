import React, { useState, useEffect, useCallback } from 'react';
import {useParams, useNavigate } from 'react-router-dom';

import '../../styles/AdminOrders.css';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../service/axiosInstance';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';

function UpdateOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [order, setOrder] = useState({
        user: { userId: '', name: '', email: '' },
        orderItems: [],
        orderDate: '',
        status: '',
        shippingAddress: '',
        phone: '',
        paymentMethod: '',
    });
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [usersResponse, productsResponse, orderResponse] = await Promise.all([
                axiosInstance.get('/users'),
                axiosInstance.get('/products'),
                axiosInstance.get(`/orders/${id}`),
            ]);
            setUsers(usersResponse.data);
            setProducts(productsResponse.data);
            setOrder({
                ...orderResponse.data,
                orderDate: new Date(orderResponse.data.orderDate).toISOString().split('T')[0],
            });
        } catch (err) {
            setError(t('adminEditOrder.fetchError'));
        } finally {
            setLoading(false);
        }
    }, [id, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrder((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserChange = (e) => {
        const userId = e.target.value;
        const selectedUser = users.find((user) => user.userId === userId);
        setOrder((prev) => ({
            ...prev,
            user: {
                userId,
                name: selectedUser?.name || '',
                email: selectedUser?.email || '',
            },
        }));
    };

    const handleAddOrderItem = () => {
        setOrder((prev) => ({
            ...prev,
            orderItems: [
                ...prev.orderItems,
                { product: { productId: '', name: '', price: 0 }, quantity: 1, pricePerUnit: 0 },
            ],
        }));
    };

    const handleOrderItemChange = (index, field, value) => {
        const updatedItems = [...order.orderItems];
        if (field === 'productId') {
            const selectedProduct = products.find((p) => p.productId === value);
            updatedItems[index] = {
                ...updatedItems[index],
                product: {
                    productId: value,
                    name: selectedProduct?.name || '',
                    price: selectedProduct?.price || 0,
                },
                pricePerUnit: selectedProduct?.price || 0,
            };
        } else {
            updatedItems[index] = { ...updatedItems[index], [field]: value };
        }
        setOrder((prev) => ({ ...prev, orderItems: updatedItems }));
    };

    const handleRemoveOrderItem = (index) => {
        setOrder((prev) => ({
            ...prev,
            orderItems: prev.orderItems.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const orderData = {
                ...order,
                totalAmount: order.orderItems.reduce(
                    (sum, item) => sum + item.quantity * item.pricePerUnit,
                    0
                ),
            };
            await axiosInstance.put(`/orders/${id}`, orderData);
            navigate('/admin/orders');
        } catch (err) {
            setError(t('adminEditOrder.updateError'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

    return (
        <div className="admin-orders-section">
            <h1>{t('adminEditOrder.title')} #{id}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">{t('adminEditOrder.user')}</label>
                    <select
                        className="form-select"
                        name="userId"
                        value={order.user.userId}
                        onChange={handleUserChange}
                        required
                    >
                        <option value="">{t('adminEditOrder.selectUser')}</option>
                        {users.map((user) => (
                            <option key={user.userId} value={user.userId}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">{t('adminEditOrder.orderDate')}</label>
                    <input
                        type="date"
                        className="form-control"
                        name="orderDate"
                        value={order.orderDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">{t('adminEditOrder.status')}</label>
                    <select
                        className="form-select"
                        name="status"
                        value={order.status}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="PENDING">{t('adminEditOrder.statusPending')}</option>
                        <option value="PROCESSING">{t('adminEditOrder.statusProcessing')}</option>
                        <option value="SHIPPED">{t('adminEditOrder.statusShipped')}</option>
                        <option value="DELIVERED">{t('adminEditOrder.statusDelivered')}</option>
                        <option value="CANCELLED">{t('adminEditOrder.statusCancelled')}</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">{t('adminEditOrder.shippingAddress')}</label>
                    <input
                        type="text"
                        className="form-control"
                        name="shippingAddress"
                        value={order.shippingAddress}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">{t('adminEditOrder.phone')}</label>
                    <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={order.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">{t('adminEditOrder.paymentMethod')}</label>
                    <select
                        className="form-select"
                        name="paymentMethod"
                        value={order.paymentMethod}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">{t('adminEditOrder.selectPaymentMethod')}</option>
                        <option value="CASH">{t('adminEditOrder.paymentCash')}</option>
                        <option value="CARD">{t('adminEditOrder.paymentCard')}</option>
                        <option value="BANK_TRANSFER">{t('adminEditOrder.paymentBank')}</option>
                    </select>
                </div>

                <h3>{t('adminEditOrder.orderItems')}</h3>
                {order.orderItems.map((item, index) => (
                    <div key={index} className="order-item mb-3 border p-3">
                        <div className="mb-2">
                            <label className="form-label">{t('adminEditOrder.product')}</label>
                            <select
                                className="form-select"
                                value={item.product.productId}
                                onChange={(e) => handleOrderItemChange(index, 'productId', e.target.value)}
                                required
                            >
                                <option value="">{t('adminEditOrder.selectProduct')}</option>
                                {products.map((product) => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.name} ({product.price.toLocaleString('vi-VN')}đ)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="form-label">{t('adminEditOrder.quantity')}</label>
                            <input
                                type="number"
                                className="form-control"
                                value={item.quantity}
                                onChange={(e) => handleOrderItemChange(index, 'quantity', parseInt(e.target.value))}
                                min="1"
                                required
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveOrderItem(index)}
                        >
                            {t('adminEditOrder.removeItem')}
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    className="btn btn-secondary mb-3"
                    onClick={handleAddOrderItem}
                >
                    {t('adminEditOrder.addItem')}
                </button>

                <div className="order-total">
                    <p>
                        <strong>{t('adminEditOrder.total')}:</strong>{' '}
                        {order.orderItems
                            .reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0)
                            .toLocaleString('vi-VN')}đ
                    </p>
                </div>

                <div className="admin-orders-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {t('adminEditOrder.update')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin/orders')}
                        disabled={loading}
                    >
                        {t('adminEditOrder.cancel')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateOrder