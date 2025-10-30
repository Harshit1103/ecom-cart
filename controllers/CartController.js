import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";


export const getCart = async (req, res) => {
  try {
    console.log("Fetching cart items...");
    
    const cartItems = await CartItem.find().populate("product");
    
    console.log("Cart items found:", cartItems.length);
    console.log("Cart items:", JSON.stringify(cartItems, null, 2));
    
    
    const validItems = cartItems.filter(item => item.product !== null);
    
    console.log("Valid items:", validItems.length);
    
    const total = validItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    
    res.json({ cartItems: validItems, total });
  } catch (err) {
    console.error("Cart fetch error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      message: "Error fetching cart", 
      error: err.message || err.toString()
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    
    const { productId, qty } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    console.log("Adding product to cart:", productId, "qty:", qty);
    
    const existingItem = await CartItem.findOne({ product: productId });

    if (existingItem) {
      console.log("Item exists, updating quantity");
      existingItem.quantity += qty;
      await existingItem.save();
    } else {
      console.log("Creating new cart item");
      await CartItem.create({ product: productId, quantity: qty });
    }

    res.status(201).json({ message: "Item added to cart" });
  } catch (err) {
    console.error("Error in addToCart:", err);
    res.status(500).json({ 
      message: "Error adding to cart", 
      error: err.message 
    });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await CartItem.findByIdAndDelete(id);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart", error: err });
  }
};
