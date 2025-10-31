import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [receipt, setReceipt] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart");
      setCart(res.data.cartItems);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email) {
      alert("Please fill in all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/checkout", {
        name: form.name,
        email: form.email,
      });
      
      setReceipt(res.data);
      setCart([]);
      setTotal(0);
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Error processing checkout";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (receipt) {
    return (
      <div style={{ 
        maxWidth: 700, 
        margin: "40px auto",
        padding: 20
      }}>
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: 40,
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: 80,
            marginBottom: 20,
            animation: "bounce 1s ease"
          }}>
            ✅
          </div>
          <h2 style={{ color: "#51cf66", marginBottom: 10 }}>Order Confirmed!</h2>
          <p style={{ color: "#666", marginBottom: 30 }}>
            Thank you for your purchase
          </p>
          
          <div style={{
            background: "#f8f9fa",
            borderRadius: 12,
            padding: 20,
            marginBottom: 25,
            textAlign: "left"
          }}>
            <h3 style={{ marginBottom: 15 }}>Order Details</h3>
            <p style={{ marginBottom: 8 }}>
              <strong>Customer:</strong> {receipt.customerName}
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong>Email:</strong> {receipt.customerEmail}
            </p>
            <p style={{ marginBottom: 15 }}>
              <strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}
            </p>
            
            <hr style={{ margin: "20px 0", border: "none", borderTop: "2px solid #e0e0e0" }} />
            
            <h4 style={{ marginBottom: 15 }}>Items:</h4>
            {receipt.items.map((item, index) => (
              <div key={index} style={{ 
                marginBottom: 12,
                padding: 10,
                background: "white",
                borderRadius: 8
              }}>
                <p style={{ fontWeight: "600", marginBottom: 5 }}>
                  {item.name}
                </p>
                <p style={{ color: "#666", fontSize: 14 }}>
                  ₹{item.price} × {item.quantity} = <strong>₹{item.subtotal}</strong>
                </p>
              </div>
            ))}
            
            <hr style={{ margin: "20px 0", border: "none", borderTop: "2px solid #e0e0e0" }} />
            
            <div style={{ textAlign: "right" }}>
              <h3 style={{ 
                fontSize: 28,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Total: ₹{receipt.total}
              </h3>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setReceipt(null);
              setForm({ name: "", email: "" });
              navigate("/");
            }}
            style={{
              padding: "12px 30px",
              fontSize: 16
            }}
          >
            Continue Shopping
          </button>
          
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: 700, 
      margin: "40px auto",
      padding: 20
    }}>
      <h2>💳 Checkout</h2>
      
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
          <button 
            onClick={() => navigate("/")}
            style={{
              padding: "12px 30px",
              marginTop: 15
            }}
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <>
          <div style={{ 
            background: "white",
            borderRadius: 16,
            padding: 25,
            marginTop: 30,
            marginBottom: 25,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
            {cart.map((item) => (
              <div key={item._id} style={{ 
                marginBottom: 15,
                paddingBottom: 15,
                borderBottom: "1px solid #e0e0e0"
              }}>
                <p style={{ fontWeight: "600", marginBottom: 5 }}>
                  {item.product?.name}
                </p>
                <p style={{ color: "#666", fontSize: 14 }}>
                  ₹{item.product?.price} × {item.quantity} = <strong>₹{item.product?.price * item.quantity}</strong>
                </p>
              </div>
            ))}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              paddingTop: 20,
              borderTop: "2px solid #e0e0e0"
            }}>
              <h3 style={{ fontSize: 22 }}>Total:</h3>
              <h3 style={{ 
                fontSize: 28,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                ₹{total}
              </h3>
            </div>
          </div>

          <div style={{
            background: "white",
            borderRadius: 16,
            padding: 30,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginBottom: 25 }}>Customer Information</h3>
            <form onSubmit={handleCheckout}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: 8, 
                  fontWeight: "600",
                  color: "#333"
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ marginBottom: 25 }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: 8, 
                  fontWeight: "600",
                  color: "#333"
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: 15,
                  fontSize: 18,
                  fontWeight: "bold"
                }}
              >
                {loading ? "Processing..." : `Place Order - ₹${total}`}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
