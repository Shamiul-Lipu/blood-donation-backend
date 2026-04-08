import express from "express";

import { UserRole } from "../../../generated/prisma/enums";
import { authorize } from "../../middleware/authorize";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createRequestSchema,
  updateRequestStatusSchema,
} from "./request.validation";
import { RequestController } from "./request.controller";

const router = express.Router();

router.post(
  "/",
  authorize(UserRole.USER),
  validateRequest(createRequestSchema),
  RequestController.createRequest,
);

router.get(
  "/my-requests",
  authorize(UserRole.USER),
  RequestController.getMyRequests,
);

router.get(
  "/my-donor-requests",
  authorize(UserRole.USER),
  RequestController.getMyDonorRequests,
);

router.put(
  "/:id",
  authorize(UserRole.USER),
  validateRequest(updateRequestStatusSchema),
  RequestController.updateRequestStatus,
);

export const RequestRouter = router;
