import express from "express";

import { UserRole } from "../../../generated/prisma/enums";
import { authorize } from "../../middleware/authorize";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { updateUserSchema } from "./admin.validation";

const router = express.Router();

router.get(
  "/users",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllUsers,
);

router.put(
  "/users/:id",
  authorize(UserRole.SUPER_ADMIN),
  validateRequest(updateUserSchema),
  AdminController.updateUser,
);

router.get(
  "/requests",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllRequests,
);

router.get(
  "/donations",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllDonations,
);

export const AdminRouter = router;
