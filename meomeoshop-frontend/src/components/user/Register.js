import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    const registrationData = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      address: address
    };

    fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })
    .then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const errorMsg = data && data.message ? data.message : response.status;
        if (response.status === 409) {
            setError('Email đã tồn tại. Vui lòng sử dụng email khác.');
        } else if (response.status === 400) {
             setError('Dữ liệu đăng ký không hợp lệ. Vui lòng kiểm tra lại thông tin.');
        } else {
            setError('Đăng ký thất bại. Vui lòng thử lại.' + (data ? ': ' + (data.message || JSON.stringify(data)) : ''));
        }
        throw new Error(response.statusText || 'Registration failed');
      }
      return data;
    })
    .then(data => {
      console.log('Đăng ký thành công:', data);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
       setTimeout(() => {
         navigate('/login');
       }, 2000);
    })
    .catch(error => {
      console.error('Lỗi khi gọi API đăng ký:', error);
      if (!error) {
         setError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
      }
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <h2>Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
           <div className="form-group">
            <label htmlFor="phone">Điện thoại:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Địa chỉ:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="auth-button">Đăng ký</button>
        </form>
        <Link to="/login" className="auth-link">Đã có tài khoản? Đăng nhập</Link>
      </div>
    </div>
  );
}

export default Register; 