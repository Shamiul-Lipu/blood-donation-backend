import { asyncHandler } from "../../middleware/asyncHandler";
import { CampaignService } from "./campaign.service";

const getAllCampaigns = asyncHandler(async (req, res) => {
  const result = await CampaignService.getAllCampaigns(req.query);
  res.status(200).json({
    success: true,
    message: "Campaigns retrieved successfully",
    data: result,
  });
});

const getCampaignById = asyncHandler(async (req, res) => {
  const result = await CampaignService.getCampaignById(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Campaign retrieved successfully",
    data: result,
  });
});

const createCampaign = asyncHandler(async (req, res) => {
  const result = await CampaignService.createCampaign(req.user, req.body);
  res.status(201).json({
    success: true,
    message: "Campaign created successfully",
    data: result,
  });
});

const updateCampaign = asyncHandler(async (req, res) => {
  const result = await CampaignService.updateCampaign(
    req.user,
    req.params.id as string,
    req.body
  );
  res.status(200).json({
    success: true,
    message: "Campaign updated successfully",
    data: result,
  });
});

const deleteCampaign = asyncHandler(async (req, res) => {
  await CampaignService.deleteCampaign(req.user, req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Campaign deleted successfully",
    data: null,
  });
});

export const CampaignController = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
