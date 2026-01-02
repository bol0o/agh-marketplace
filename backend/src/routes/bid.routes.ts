import { Router } from "express";
import { placeBid, getBidsForProduct } from "../controllers/bid.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/product/:productId", getBidsForProduct);
router.post("/", authenticateToken, placeBid);

export default router;
