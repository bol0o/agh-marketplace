import { Router } from "express";
import { createOrder, getOrders } from "../controllers/order.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken); //Authentication to all routes below

router.post("/", createOrder); // POST /api/orders
router.get("/", getOrders); // GET /api/orders

export default router;
