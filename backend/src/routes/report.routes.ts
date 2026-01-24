import { Router } from "express";
import { createReport } from "../controllers/report.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticateToken);

router.post("/", createReport); // POST /api/reports

export default router;
