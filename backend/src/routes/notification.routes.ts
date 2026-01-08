import { Router } from "express";
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notification.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getNotifications); // GET /api/notifications
router.get("/unread-count", getUnreadCount); // GET /api/notifications/unread-count
router.patch("/mark-all-read", markAllRead); // PATCH /api/notifications/mark-all-read
router.patch("/:id/read", markRead); // PATCH /api/notifications/:id/read
router.delete("/:id", deleteNotification); // DELETE /api/notifications/:id

export default router;
