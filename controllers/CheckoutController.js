import CartItem from "../models/CartItem.js";

export const checkout = async (req, res) => {
  try {
    console.log("Checkout request received:", req.body);
    
    const { name, email } = req.body;
    
    if (!name || !email) {
      console.log("Missing name or email");
      return res.status(400).json({ message: "Name and email are required" });
    }

    
    const cartItems = await CartItem.find().populate("product");
    
    console.log("Cart items found:", cartItems.length);
    
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    
    const total = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    console.log("Total calculated:", total);

    
    const receipt = {
      customerName: name,
      customerEmail: email,
      items: cartItems.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity
      })),
      total: total,
      timestamp: new Date().toISOString(),
    };

    console.log("Receipt created:", receipt);

    
    await CartItem.deleteMany({});
    
    console.log("Cart cleared");

    res.status(200).json(receipt);
  } catch (err) {
    console.error("Checkout error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      message: "Error processing checkout", 
      error: err.message 
    });
  }
};