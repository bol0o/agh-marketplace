import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimit.middleware";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", authenticateToken, logout);

export default router;
