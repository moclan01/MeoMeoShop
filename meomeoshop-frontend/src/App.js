import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/user/Header';
import Footer from './components/user/Footer';
import HomePage from './components/user/HomePage';
import ProductDetail from './components/user/ProductDetail';
import Cart from './components/user/Cart';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Checkout from './components/user/Checkout';
// Import Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminCustomers from './components/admin/AdminCustomers';
import AdminCategories from './components/admin/AdminCategories';
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

  // Effect to save cart items to localStorage whenever cartItems state changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]); // Dependency array ensures effect runs only when cartItems changes

  return (
    <Router>
      <div className="App">
        <Header cartItems={cartItems} />
        <MainContent>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<HomePage cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/products/:productId" element={<ProductDetail cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />

            {/* Admin Routes - Protected by PrivateRoute */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            >
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
