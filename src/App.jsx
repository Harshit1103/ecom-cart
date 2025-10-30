import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import axios from "axios";
import "./App.css";

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    fetchCartCount();
    
  }, [location]);

  const fetchCartCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart");
      const count = res.data.cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            🛍️ ShopEase
          </Link>
          
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Products</span>
            </Link>
            
            <Link 
              to="/cart" 
              className={`nav-link ${location.pathname === "/cart" ? "active" : ""}`}
            >
              <span className="nav-icon">🛒</span>
              <span className="nav-text">Cart</span>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
            
            <Link 
              to="/checkout" 
              className={`nav-link ${location.pathname === "/checkout" ? "active" : ""}`}
            >
              <span className="nav-icon">💳</span>
              <span className="nav-text">Checkout</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2024 ShopEase. All rights reserved.</p>
      </footer>
    </div>
  );
}