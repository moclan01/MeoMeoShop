import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../service/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

function AddCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
       setError('addCategory.emptyNameError');
      return;
    }
    try {
      await axiosInstance.post('/categories', { name, description });
      navigate('/admin/categories');
    } catch (err) {
      setError('addCategory.createError');
    }
  };
  return (
    <div className="container mt-4">
      <h2>{t('addCategory.title')}</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {error && <div className="alert alert-danger">{t(error)}</div>}

        <div className="mb-3">
          <label className="form-label">{t('addCategory.nameLabel')}</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('addCategory.namePlaceholder')}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('addCategory.descriptionLabel')}</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('addCategory.descriptionPlaceholder')}
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn-primary">{t('addCategory.submit')}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/categories')}>{t('addCategory.cancel')}</button>
      </form>
    </div>
  );
}

export default AddCategory;
