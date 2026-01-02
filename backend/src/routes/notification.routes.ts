import { Router } from "express";
import {
  getNotifications,
  markRead,
} from "../controllers/notification.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getNotifications); // GET /api/notifications/
router.patch("/:id/read", markRead); // PATCH /api/notifications/:id/read

export default router;
