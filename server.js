import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CartRoutes from './routes/CartRoutes.js';
import Product from './models/Product.js';
import CartItem from './models/CartItem.js';
import CheckoutRoutes from './routes/CheckoutRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


app.delete("/api/cart/clear-all", async (req, res) => {
    try {
        await CartItem.deleteMany({});
        res.json({ message: "Cart cleared successfully" });
    } catch (err) {
        res.status(500).json({ 
            message: "Error clearing cart", 
            error: err.message 
        });
    }
});


app.use('/api/cart', CartRoutes);
app.use('/api/checkout', CheckoutRoutes);


app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching products", 
            error: err.message 
        });
    }
});


app.post("/api/products", async (req, res) => {
    try {
        const { name, price } = req.body;
        const newProduct = await Product.create({ name, price });
        res.status(201).json({ 
            message: "Product created successfully", 
            product: newProduct 
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Error creating product", 
            error: err.message 
        });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);


mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            await Product.insertMany([
                { name: "Nike Shoes", price: 4999 },
                { name: "Puma Jacket", price: 2999 },
                { name: "Adidas Bag", price: 1999 },
                { name: "HRX T-Shirt", price: 1499 },
                { name: "Apple Watch", price: 24999 },
            ]);
            console.log('✅ Products seeded');
        }
    })
    .catch((error) => {
        console.error('❌ Error connecting to MongoDB:', error);
    });