import { Router } from "express";
import {
  getMe,
  updateProfile,
  updateAddress,
  updateSettings,
  getPublicProfile,
} from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  updateProfileSchema,
  updateAddressSchema,
  updateSettingsSchema,
} from "../schemas/user.schema";

const router = Router();

router.use(authenticateToken);

router.get("/me", getMe);
router.patch("/me", validate(updateProfileSchema), updateProfile);
router.patch("/me/address", validate(updateAddressSchema), updateAddress);
router.patch("/me/settings", validate(updateSettingsSchema), updateSettings);

router.get("/:id", getPublicProfile);

export default router;
