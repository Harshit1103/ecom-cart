import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState({});

  const fetchData = async () => {
    try {
      const [productsRes, cartRes] = await Promise.all([
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/cart")
      ]);
      
      setProducts(productsRes.data.products);
      setCart(cartRes.data.cartItems);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getQuantity = (productId) => {
    const cartItem = cart.find(item => item.product._id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const updateCart = async (productId, change) => {
    setLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      await axios.post("http://localhost:5000/api/cart", {
        productId: productId,
        qty: change,
      });
      
      await fetchData();
    } catch (err) {
      console.error("Error updating cart:", err);
      alert("Error updating cart");
    } finally {
      setLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div style={{ 
      padding: "40px 20px",
      maxWidth: 1200,
      margin: "0 auto"
    }}>
      <h2>🛍️ Products</h2>
      {products.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: 40,
          background: "white",
          borderRadius: 12,
          color: "#666"
        }}>
          <p style={{ fontSize: 18 }}>Loading products...</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 25,
          marginTop: 30
        }}>
          {products.map((p) => {
            const quantity = getQuantity(p._id);
            const isLoading = loading[p._id];

            return (
              <div 
                key={p._id} 
                style={{ 
                  background: "white",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                }}
              >
               
                <div style={{
                  position: "absolute",
                  top: 15,
                  right: 15,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: "bold"
                }}>
                  NEW
                </div>

                
                <div style={{
                  width: "100%",
                  height: 180,
                  background: "linear-gradient(135deg, #e0e7ff 0%, #f0e7ff 100%)",
                  borderRadius: 12,
                  marginBottom: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48
                }}>
                  {p.name.includes("Shoes") ? "👟" : 
                   p.name.includes("Jacket") ? "🧥" :
                   p.name.includes("Bag") ? "🎒" :
                   p.name.includes("Shirt") ? "👕" :
                   p.name.includes("Watch") ? "⌚" : "🛍️"}
                </div>

                <h4 style={{ 
                  margin: "0 0 10px 0",
                  fontSize: 18,
                  color: "#333"
                }}>
                  {p.name}
                </h4>
                
                <p style={{ 
                  fontSize: 24, 
                  fontWeight: "bold", 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 15
                }}>
                  ₹{p.price}
                </p>
                
                {quantity === 0 ? (
                  <button 
                    onClick={() => updateCart(p._id, 1)}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: 15,
                      fontWeight: "bold"
                    }}
                  >
                    {isLoading ? "Adding..." : "🛒 Add to Cart"}
                  </button>
                ) : (
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    background: "#f8f9fa",
                    padding: 10,
                    borderRadius: 12,
                    gap: 10
                  }}>
                    <button 
                      onClick={() => updateCart(p._id, -1)}
                      disabled={isLoading}
                      style={{
                        width: 40,
                        height: 40,
                        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                        fontSize: 20,
                        fontWeight: "bold",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      −
                    </button>
                    
                    <span style={{ 
                      fontSize: 18, 
                      fontWeight: "bold",
                      minWidth: 40,
                      textAlign: "center",
                      color: "#667eea"
                    }}>
                      {quantity}
                    </span>
                    
                    <button 
                      onClick={() => updateCart(p._id, 1)}
                      disabled={isLoading}
                      style={{
                        width: 40,
                        height: 40,
                        background: "linear-gradient(135deg, #51cf66 0%, #37b24d 100%)",
                        fontSize: 20,
                        fontWeight: "bold",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}