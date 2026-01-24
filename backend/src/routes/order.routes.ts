import { Router } from "express";
import {
  createOrder,
  getOrders,
  getSales,
  getOrderById,
  payOrder,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema";

const router = Router();

router.use(authenticateToken);

// Order Management
router.get("/", getOrders); // My purchases
router.get("/sales", getSales); // My sales
router.get("/:id", getOrderById); // Details

router.post("/", validate(createOrderSchema), createOrder); // Create order
router.post("/:id/pay", payOrder); // Simulate payment

// Status Update (e.g. for sellers/admin)
router.patch(
  "/:id/status",
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);
router.patch("/:id/cancel", cancelOrder);

export default router;
