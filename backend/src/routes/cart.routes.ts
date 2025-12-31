import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cart.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, getCart); // GET /api/cart
router.post("/add", authenticateToken, addToCart); // POST /api/cart/items
router.delete("/remove/:itemId", authenticateToken, removeFromCart); // DELETE /api/cart/items/123

export default router;
