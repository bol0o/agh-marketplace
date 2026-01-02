import { Router, Response, NextFunction } from "express";
import {
  getAllUsers,
  toggleBlockUser,
  changeUserRole,
} from "../controllers/admin.controller";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Middleware to check if the user is an admin
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return res
      .status(403)
      .json({
        error: "Dostęp zabroniony: wymagana uprawnienia administratora",
      });
  }
  next();
};

router.use(authenticateToken, requireAdmin);

router.get("/users", getAllUsers);
router.patch("/users/:userId/toggle-block", toggleBlockUser);
router.patch("/users/:userId/role", changeUserRole);

export default router;
