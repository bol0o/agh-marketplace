import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/chat.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);

router.get("/:otherUserId", getMessages); // GET /api/chat/:otherUserId
router.post("/", sendMessage); // POST /api/chat/

export default router;
