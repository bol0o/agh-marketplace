import { Router } from "express";
import {
  addReview,
  getReviewsForUser,
  deleteReview,
} from "../controllers/review.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/:userId", getReviewsForUser); // GET /api/reviews/:userId (Get reviews received by user)

router.use(authenticateToken);
router.post("/", addReview); // POST /api/reviews (Body: revieweeId, rating, comment)
router.delete("/:reviewId", deleteReview); // DELETE /api/reviews/:reviewId

export default router;
