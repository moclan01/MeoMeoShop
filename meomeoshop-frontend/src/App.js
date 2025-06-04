import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './i18n/i18n'; // Import i18n configuration
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
import Order from './components/user/Order';
import OrderSuccess from './components/user/OrderSuccess';
import Orders from './components/user/Orders';
// Import Contact component
import Contact from './components/user/Contact';
import AddCategory from './components/admin/CRUD/AddCategory';
import EditCategory from './components/admin/CRUD/UpdateCategory';
import AddProduct from './components/admin/CRUD/AddProduct';
import EditProduct from './components/admin/CRUD/UpdateProduct';

function App() {
  // State for logged-in user, initialized from localStorage
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Function to handle user login
  const handleLogin = async (userData) => {
    // Save initial user data from login response
    setLoggedInUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // If cart information is missing from login response, try fetching the cart
    if (!userData.cart || !userData.cart.cartId) {
      console.log('Cart info missing in login response, attempting to fetch cart...');
      const userId = userData.userId;
      if (userId) {
        try {
          // Use the /by-user endpoint we added
          const cartResponse = await fetch(`http://localhost:8080/api/carts/by-user/${userId}`, {
            // Thêm tùy chọn này để gửi cookies (session cookie)
            credentials: 'include'
          });
          if (cartResponse.ok) {
            const cartData = await cartResponse.json();
            console.log('Fetched cart after login:', cartData);
            const updatedUserData = { ...userData, cart: cartData };
            setLoggedInUser(updatedUserData);
            localStorage.setItem('user', JSON.stringify(updatedUserData));
          } else {
            console.error('Failed to fetch cart after login:', cartResponse.status);
          }
        } catch (error) {
          console.error('Error fetching cart after login:', error);
        }
      }
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('user');
    // Điều hướng về trang chủ sau khi logout
    // Lưu ý: useNavigate chỉ sử dụng được trong component được render bởi Routes/Router
    // Chúng ta cần xử lý điều hướng này ở component gọi handleLogout (ví dụ: Profile, AdminDashboard)
  };

  // Function to update cart data within the loggedInUser state
  const updateCartInUserState = (cartData) => {
    if (loggedInUser) {
      const updatedUserData = { ...loggedInUser, cart: cartData };
      setLoggedInUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      console.log('User state updated with new cart:', updatedUserData);
    }
  };

  return (
    <Router>
      <div className="App">
        <Header loggedInUser={loggedInUser} cart={loggedInUser?.cart} />
        <MainContent>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<HomePage loggedInUser={loggedInUser} updateCartInUserState={updateCartInUserState} />} />
            <Route
              path="/products/:productId"
              element={<ProductDetail loggedInUser={loggedInUser} updateCartInUserState={updateCartInUserState} />}
            />
            <Route path="/cart" element={<Cart loggedInUser={loggedInUser} updateCartInUserState={updateCartInUserState} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/checkout"
              element={<Order loggedInUser={loggedInUser} updateCartInUserState={updateCartInUserState} />}
            />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders loggedInUser={loggedInUser} />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />

            {/* New Contact Route */}
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes - Protected by PrivateRoute */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard onLogout={handleLogout} />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboardContent />} />
              <Route path="dashboard" element={<AdminDashboardContent />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:productId" element={<EditProduct />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="categories/add" element={<AddCategory />} />
              <Route path="categories/edit/:categoryId" element={<EditCategory />} />
            </Route>
          </Routes>
        </MainContent>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
