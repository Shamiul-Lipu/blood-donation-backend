import { asyncHandler } from "../../middleware/asyncHandler";
import { RequestService } from "./request.service";

const createRequest = asyncHandler(async (req, res) => {
  const result = await RequestService.createRequest(req.user, req.body);
  res.status(201).json({
    success: true,
    message: "Request successfully made",
    data: result,
  });
});

const getMyRequests = asyncHandler(async (req, res) => {
  const result = await RequestService.getMyRequests(req.user, req.query);
  res.status(200).json({
    success: true,
    message: "Requests retrieved successfully",
    data: result,
  });
});

const getMyDonorRequests = asyncHandler(async (req, res) => {
  const result = await RequestService.getMyDonorRequests(req.user, req.query);
  res.status(200).json({
    success: true,
    message: "Donor requests retrieved successfully",
    data: result,
  });
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const result = await RequestService.updateRequestStatus(
    req.user,
    req.params.id as string,
    req.body,
  );
  res.status(200).json({
    success: true,
    message: "Request status updated successfully",
    data: result,
  });
});

export const RequestController = {
  createRequest,
  getMyRequests,
  getMyDonorRequests,
  updateRequestStatus,
};
