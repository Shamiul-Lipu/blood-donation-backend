import express, { Router } from "express";

import { UserRole } from "../../../generated/prisma/enums";
import { authorize } from "../../middleware/authorize";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateMyProfileSchema } from "./user.validation";

const router = express.Router();

router.get(
  "/my-profile",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  UserController.getMyProfile,
);

router.put(
  "/my-profile",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(updateMyProfileSchema),
  UserController.updateMyProfile,
);

router.get("/donors", UserController.getAvailableDonors);

export const UserRouter = router;
