import { asyncHandler } from "../../middleware/asyncHandler";
import { DonationService } from "./donation.service";

const createDonation = asyncHandler(async (req, res) => {
  const result = await DonationService.createDonation(req.user, req.body);
  res.status(201).json({
    success: true,
    message: "Donation initiated successfully",
    data: result,
  });
});

const getMyDonations = asyncHandler(async (req, res) => {
  const result = await DonationService.getMyDonations(req.user, req.query);
  res.status(200).json({
    success: true,
    message: "Donation history retrieved successfully",
    data: result,
  });
});

const initPayment = asyncHandler(async (req, res) => {
  const { donationId } = req.body;
  const result = await DonationService.initPayment(req.user, donationId);
  res.status(200).json({
    success: true,
    message: "Payment initialized successfully",
    data: result,
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  // Extract webhook payload based on typical integration
  const transactionId = req.body.transactionId || req.query.transactionId as string;
  const status = req.body.status || req.query.status as string;

  const isSuccess = await DonationService.verifyPayment(transactionId, status);
  
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  
  if (isSuccess) {
    res.redirect(`${frontendUrl}/payment/success?txn=${transactionId}`);
  } else {
    res.redirect(`${frontendUrl}/payment/failed?txn=${transactionId}`);
  }
});

export const DonationController = {
  createDonation,
  getMyDonations,
  initPayment,
  verifyPayment,
};
