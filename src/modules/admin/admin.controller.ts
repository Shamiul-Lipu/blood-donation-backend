import { asyncHandler } from "../../middleware/asyncHandler";
import { AdminService } from "./admin.service";

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await AdminService.getAllUsers(req.query);
  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const result = await AdminService.updateUser(
    req.user,
    req.params.id as string,
    req.body
  );
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const getAllRequests = asyncHandler(async (req, res) => {
  const result = await AdminService.getAllRequests(req.query);
  res.status(200).json({
    success: true,
    message: "Requests retrieved successfully",
    data: result,
  });
});

const getAllDonations = asyncHandler(async (req, res) => {
  const result = await AdminService.getAllDonations(req.query);
  res.status(200).json({
    success: true,
    message: "Donations retrieved successfully",
    data: result,
  });
});

export const AdminController = {
  getAllUsers,
  updateUser,
  getAllRequests,
  getAllDonations,
};
