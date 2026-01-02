import { Router } from "express";
import { toggleFollow, getFeed } from "../controllers/social.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);

router.post("/follow", toggleFollow);
router.get("/feed", getFeed);

export default router;
