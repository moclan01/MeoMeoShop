import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../service/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function AddCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tên danh mục không được để trống.');
      return;
    }
    try {
      await axiosInstance.post('/categories', { name, description });
      navigate('/admin/categories');
    } catch (err) {
      setError('Không thể thêm danh mục. Vui lòng thử lại.');
    }
  };
  return (
    <div className="container mt-4">
      <h2>Thêm Danh mục</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Tên danh mục</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên danh mục"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả danh mục"
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn-primary">Thêm</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/categories')}>Hủy</button>
      </form>
    </div>
  );
}

export default AddCategory;
