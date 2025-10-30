import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart");
      setCart(res.data.cartItems);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (id) => {
    await axios.delete(`http://localhost:5000/api/cart/${id}`);
    fetchCart();
  };

  return (
    <div style={{
      padding: "40px 20px",
      maxWidth: 900,
      margin: "0 auto"
    }}>
      <h2>🛒 Shopping Cart</h2>
      {cart.length === 0 ? (
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: 60,
          textAlign: "center",
          marginTop: 30,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
          <h3 style={{ marginBottom: 10, color: "#666" }}>Your cart is empty</h3>
          <p style={{ color: "#999", marginBottom: 25 }}>Add some products to get started!</p>
          <button 
            onClick={() => navigate("/")}
            style={{
              padding: "12px 30px",
              fontSize: 16
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          {cart.map((item) => (
            <div 
              key={item._id}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 20,
                marginBottom: 15,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: 8, fontSize: 18 }}>
                  {item.product?.name}
                </h4>
                <p style={{ color: "#666", marginBottom: 5 }}>
                  ₹{item.product?.price} × {item.quantity}
                </p>
                <p style={{ 
                  fontWeight: "bold", 
                  fontSize: 18,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  ₹{item.product?.price * item.quantity}
                </p>
              </div>
              <button 
                onClick={() => removeItem(item._id)}
                style={{
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                  padding: "10px 20px"
                }}
              >
                🗑️ Remove
              </button>
            </div>
          ))}
          
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: 30,
            marginTop: 25,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20
            }}>
              <h3 style={{ fontSize: 24 }}>Total:</h3>
              <h3 style={{ 
                fontSize: 32,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                ₹{total}
              </h3>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}