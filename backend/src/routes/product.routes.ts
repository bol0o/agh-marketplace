import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";

const router = Router();

// Public Routes
router.get("/", optionalAuth, getProducts); // GET /api/products
router.get("/:id", getProductById); // GET /api/products/:id

// Protected Routes
router.use(authenticateToken);

router.post("/", validate(createProductSchema), createProduct); // POST /api/products
router.patch("/:id", validate(updateProductSchema), updateProduct); // PATCH /api/products/:id
router.delete("/:id", deleteProduct); // DELETE /api/products/:id

export default router;
