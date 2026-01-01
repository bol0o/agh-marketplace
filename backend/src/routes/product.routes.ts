import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getProducts); // GET /api/products
router.get("/:id", getProduct); // GET /api/products/123

// 1. Authenticate user
// 2. Process image upload (field name must be "image")
// 3. Create product in DB
router.post("/", authenticateToken, upload.single("image"), createProduct);

router.delete("/:id", authenticateToken, deleteProduct);

export default router;
