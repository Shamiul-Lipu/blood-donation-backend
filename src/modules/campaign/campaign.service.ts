import { prisma } from "../../lib/prisma";

const getAllCampaigns = async (query: any) => {
  const { division, location, page = 1, limit = 10, active } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereCondition: any = {};

  if (division) whereCondition.division = division;
  if (location) whereCondition.location = location;

  if (active === "true") {
    whereCondition.deadline = { gte: new Date() };
  }

  const campaigns = await prisma.campaign.findMany({
    where: whereCondition,
    skip,
    take: Number(limit),
    include: {
      creator: {
        select: {
          name: true,
        }
      }
    }
  });

  const total = await prisma.campaign.count({
    where: whereCondition
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    },
    data: campaigns
  };
};

const getCampaignById = async (id: string) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          bloodType: true,
          location: true,
        }
      }
    }
  });

  if (!campaign) {
    throw new Error("NOT_FOUND: Campaign not found");
  }

  const progressPercentage = (campaign.raisedAmount / campaign.goalAmount) * 100;

  return {
    ...campaign,
    progressPercentage
  };
};

const createCampaign = async (user: any, payload: any) => {
  if (new Date(payload.deadline) < new Date()) {
    throw new Error("BAD_REQUEST: Deadline must be in the future");
  }

  const newCampaign = await prisma.campaign.create({
    data: {
      title: payload.title,
      description: payload.description,
      goalAmount: payload.goalAmount,
      raisedAmount: 0,
      deadline: payload.deadline,
      location: payload.location,
      division: payload.division,
      createdBy: user.id
    }
  });

  return newCampaign;
};

const updateCampaign = async (user: any, id: string, payload: any) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id }
  });

  if (!campaign) {
    throw new Error("NOT_FOUND: Campaign not found");
  }

  if (user.role === "ADMIN" && campaign.createdBy !== user.id) {
    throw new Error("FORBIDDEN: You can only update your own campaigns");
  }

  const updatedCampaign = await prisma.campaign.update({
    where: { id },
    data: payload
  });

  return updatedCampaign;
};

const deleteCampaign = async (user: any, id: string) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id }
  });

  if (!campaign) {
    throw new Error("NOT_FOUND: Campaign not found");
  }

  const activeDonationsCount = await prisma.donation.count({
    where: { campaignId: id, paymentStatus: "PAID" }
  });

  if (activeDonationsCount > 0) {
    throw new Error("BAD_REQUEST: Cannot delete a campaign with completed donations");
  }

  if (user.role === "ADMIN" && campaign.createdBy !== user.id) {
    throw new Error("FORBIDDEN: You can only delete your own campaigns");
  }

  // Handle cascading delete of pending donations if configured.
  await prisma.donation.deleteMany({
    where: { campaignId: id, paymentStatus: "PENDING" }
  });

  await prisma.campaign.delete({
    where: { id }
  });

  return null;
};

export const CampaignService = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
