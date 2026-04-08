import express from "express";

import { UserRole } from "../../../generated/prisma/enums";
import { authorize } from "../../middleware/authorize";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createCampaignSchema,
  updateCampaignSchema,
} from "./campaign.validation";
import { CampaignController } from "./campaign.controller";

const router = express.Router();

router.get(
  "/",
  CampaignController.getAllCampaigns,
);

router.get(
  "/:id",
  CampaignController.getCampaignById,
);

router.post(
  "/",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createCampaignSchema),
  CampaignController.createCampaign,
);

router.put(
  "/:id",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateCampaignSchema),
  CampaignController.updateCampaign,
);

router.delete(
  "/:id",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CampaignController.deleteCampaign,
);

export const CampaignRouter = router;
