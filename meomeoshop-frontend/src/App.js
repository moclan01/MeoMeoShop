import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/user/Header';
import Footer from './components/user/Footer';
import HomePage from './components/user/HomePage';
import ProductDetail from './components/user/ProductDetail';
import Cart from './components/user/Cart';

function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <Router>
      <div className="App">
        <Header cartItems={cartItems} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/products/:productId" element={<ProductDetail cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
