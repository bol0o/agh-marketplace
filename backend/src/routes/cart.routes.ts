import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../controllers/cart.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addToCartSchema, updateCartItemSchema } from "../schemas/cart.schema";

const router = Router();

router.use(authenticateToken);

router.get("/", getCart); // GET /api/cart
router.post("/", validate(addToCartSchema), addToCart); // POST /api/cart
router.patch(
  "/:itemId",
  validate(updateCartItemSchema),
  updateCartItemQuantity,
); // PATCH /api/cart/:itemId
router.delete("/:itemId", removeFromCart); // DELETE /api/cart/:itemId
router.delete("/", clearCart);

export default router;
