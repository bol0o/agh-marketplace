import { Router } from "express";
import {
  getChats,
  createChat,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createChatSchema, sendMessageSchema } from "../schemas/chat.schema";

const router = Router();

router.use(authenticateToken);

router.get("/", getChats); // GET /api/chats
router.post("/", validate(createChatSchema), createChat); // POST /api/chats

router.get("/:chatId/messages", getMessages); // GET /api/chats/:id/messages
router.post("/:chatId/messages", validate(sendMessageSchema), sendMessage); // POST

export default router;
