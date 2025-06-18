import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../../service/axiosInstance';
import { useTranslation } from 'react-i18next';

function EditCategory() {
    const { categoryId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await axiosInstance.get(`/categories/${categoryId}`);
                setName(res.data.name);
                setDescription(res.data.description || ''); // set mô tả
            } catch (err) {
                console.error('Fetch error:', err.response || err.message || err);
                setError('editCategory.fetchError');
            }
        }

        fetchCategory();
    }, [categoryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('editCategory.emptyNameError');
            return;
        }

        try {
            await axiosInstance.put(`/categories/${categoryId}`, { name, description });
            navigate('/admin/categories');
        } catch (err) {
            setError('editCategory.updateError');
        }
    };

    return (
        <div className="container mt-4">
            <h2>{t('editCategory.title')}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">{t('editCategory.nameLabel')}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('editCategory.namePlaceholder')}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">{t('editCategory.descriptionLabel')}</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('editCategory.descriptionPlaceholder')}
                        rows={3}
                    />
                </div>

                <button type="submit" className="btn btn-primary">{t('editCategory.submit')}</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/categories')}>{t('editCategory.cancel')}</button>
            </form>
        </div>
    );
}

export default EditCategory;
