import { Router, Response, NextFunction } from "express";
import {
  getAllUsers,
  toggleBlockUser,
  changeUserRole,
  getDashboardStats,
  getReports,
  updateReportStatus,
} from "../controllers/admin.controller";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Middleware: Admin Only
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      error: "Dostęp zabroniony: wymagane uprawnienia administratora",
    });
  }
  next();
};

router.use(authenticateToken, requireAdmin);

// Dashboard & Reports
router.get("/stats", getDashboardStats); // GET /api/admin/stats
router.get("/reports", getReports); // GET /api/admin/reports
router.patch("/reports/:id", updateReportStatus); // PATCH /api/admin/reports/:id

// User Management
router.get("/users", getAllUsers); // GET /api/admin/users
router.patch("/users/:userId/status", toggleBlockUser); // PATCH /api/admin/users/:id/status (Ban)
router.patch("/users/:userId/role", changeUserRole); // PATCH /api/admin/users/:id/role

export default router;
