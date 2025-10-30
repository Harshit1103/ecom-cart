import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/CartController.js";

const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:id", removeFromCart);

export default router;
