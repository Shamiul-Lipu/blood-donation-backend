import { asyncHandler } from "../../middleware/asyncHandler";
import { UserService } from "./user.service";

const getMyProfile = asyncHandler(async (req, res) => {
  const result = await UserService.getMyProfile(req.user, req.session);
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  const result = await UserService.updateMyProfile(req.user, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const getAvailableDonors = asyncHandler(async (req, res) => {
  const result = await UserService.getAvailableDonors(req.query);

  res.status(200).json({
    success: true,
    message: "Donors retrieved successfully",
    data: result,
  });
});

export const UserController = {
  getMyProfile,
  updateMyProfile,
  getAvailableDonors,
};
