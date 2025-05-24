import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/user/Header';
import Footer from './components/user/Footer';
import HomePage from './components/user/HomePage';
import ProductDetail from './components/user/ProductDetail';
import Cart from './components/user/Cart';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Checkout from './components/user/Checkout';
// Import Profile component
import Profile from './components/user/Profile';
// Import Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminCustomers from './components/admin/AdminCustomers';
import AdminCategories from './components/admin/AdminCategories';
import AdminDashboardContent from './components/admin/AdminDashboardContent';
// Import PrivateRoute
import PrivateRoute from './components/auth/PrivateRoute';
// Import MainContent
import MainContent from './components/layout/MainContent';

function App() {
  // State for cart items, initialized from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // State for logged-in user, initialized from localStorage
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Effect to save cart items to localStorage whenever cartItems state changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]); // Dependency array ensures effect runs only when cartItems changes

  // Function to handle user login
  const handleLogin = (userData) => {
    setLoggedInUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to handle user logout
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('user');
    // Điều hướng về trang chủ sau khi logout
    // Lưu ý: useNavigate chỉ sử dụng được trong component được render bởi Routes/Router
    // Chúng ta cần xử lý điều hướng này ở component gọi handleLogout (ví dụ: Profile, AdminDashboard)
  };

  return (
    <Router>
      <div className="App">
        <Header cartItems={cartItems} loggedInUser={loggedInUser} />
        <MainContent>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<HomePage cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/products/:productId" element={<ProductDetail cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
            {/* Profile Route - Truyền handleLogout xuống Profile */}
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />

            {/* Admin Routes - Protected by PrivateRoute */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  {/* Truyền handleLogout xuống AdminDashboard */}
                  <AdminDashboard onLogout={handleLogout} />
                </PrivateRoute>
              }
            >
              {/* Routes con render nội dung cụ thể */}
              <Route index element={<AdminDashboardContent />} /> {/* Render dashboard content at /admin */}
              <Route path="dashboard" element={<AdminDashboardContent />} /> {/* Render dashboard content at /admin/dashboard */}

              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>
          </Routes>
        </MainContent>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
