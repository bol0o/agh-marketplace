import { Router } from "express";
import { getProducts, getProductById } from "../controllers/product.controller";

const router = Router();

router.get("/", getProducts); // GET /api/products
router.get("/:id", getProductById); // GET /api/products/123

export default router;
