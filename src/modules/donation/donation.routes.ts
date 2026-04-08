import express from "express";

import { UserRole } from "../../../generated/prisma/enums";
import { authorize } from "../../middleware/authorize";
import { validateRequest } from "../../middleware/validateRequest";
import { DonationController } from "./donation.controller";
import { createDonationSchema, initPaymentSchema } from "./donation.validation";

const router = express.Router();

router.post(
  "/",
  authorize(UserRole.USER),
  validateRequest(createDonationSchema),
  DonationController.createDonation,
);

router.get(
  "/my-donations",
  authorize(UserRole.USER),
  DonationController.getMyDonations,
);

router.post(
  "/payment/init",
  authorize(UserRole.USER),
  validateRequest(initPaymentSchema),
  DonationController.initPayment,
);

router.post(
  "/payment/verify",
  DonationController.verifyPayment,
);

export const DonationRouter = router;
