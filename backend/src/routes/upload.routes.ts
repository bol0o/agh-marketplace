import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { handleUpload } from "../controllers/upload.controller";

const router = Router();

// Endpoint: POST /api/upload
router.post("/", upload.single("image"), handleUpload);

export default router;
