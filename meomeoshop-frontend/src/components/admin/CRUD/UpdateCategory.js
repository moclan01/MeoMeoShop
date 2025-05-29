import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../../service/axiosInstance';


function EditCategory() {
    const { categoryId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCategory() {
            try {
                const res = await axiosInstance.get(`/categories/${categoryId}`);
                setName(res.data.name);
                setDescription(res.data.description || ''); // set mô tả
            } catch (err) {
                console.error('Lỗi tải danh mục:', err.response || err.message || err);
                setError('Không thể tải thông tin danh mục.');
            }
        }

        fetchCategory();
    }, [categoryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Tên danh mục không được để trống.');
            return;
        }

        try {
            await axiosInstance.put(`/categories/${categoryId}`, { name, description });
            navigate('/admin/categories');
        } catch (err) {
            setError('Không thể cập nhật danh mục.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Chỉnh sửa Danh mục</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
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
                        rows={3}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Cập nhật</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/categories')}>Hủy</button>
            </form>
        </div>
    );
}

export default EditCategory;
