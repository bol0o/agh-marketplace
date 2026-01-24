import { Router } from "express";
import {
  toggleFollow,
  getFeed,
  getFollowStatus,
  unfollowUser,
} from "../controllers/social.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);

router.post("/follow", toggleFollow);
router.get("/feed", getFeed);
router.get("/follow/status/:id", getFollowStatus);
router.delete("/unfollow/:id", unfollowUser);

export default router;
