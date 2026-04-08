import { prisma } from "../../lib/prisma";

const getAllUsers = async (query: any) => {
  const { role, isAccountActive, bloodType, division, search, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereCondition: any = {};

  if (role) whereCondition.role = role;
  
  if (isAccountActive !== undefined) {
    whereCondition.isAccountActive = isAccountActive === "true" || isAccountActive === true;
  }
  
  if (bloodType) whereCondition.bloodType = bloodType;
  if (division) whereCondition.division = division;

  if (search) {
    whereCondition.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }

  const users = await prisma.user.findMany({
    where: whereCondition,
    include: { userProfile: true },
    skip,
    take: Number(limit)
  });

  const usersWithoutPassword = users.map((user: any) => {
    const { password, ...rest } = user;
    return rest;
  });

  const total = await prisma.user.count({ where: whereCondition });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    },
    data: usersWithoutPassword
  };
};

const updateUser = async (user: any, id: string, payload: any) => {
  const targetUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!targetUser) {
    throw new Error("NOT_FOUND: User not found");
  }

  if (targetUser.role === "SUPER_ADMIN" && (payload.role !== undefined || payload.isAccountActive !== undefined)) {
    throw new Error("FORBIDDEN: Cannot modify another SUPER_ADMIN");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload
  });

  const { password, ...rest } = updatedUser as any;
  return rest;
};

const getAllRequests = async (query: any) => {
  const { requestStatus, division, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereCondition: any = {};

  if (requestStatus) whereCondition.requestStatus = requestStatus;
  if (division) whereCondition.requesterDivision = division; // Assuming filtering by requester division

  const requests = await prisma.request.findMany({
    where: whereCondition,
    include: {
      donor: { select: { name: true, bloodType: true, location: true } },
      requester: { select: { name: true, bloodType: true, location: true } }
    },
    skip,
    take: Number(limit)
  });

  const total = await prisma.request.count({ where: whereCondition });

  const statusCounts = await prisma.request.groupBy({
    by: ['requestStatus'],
    _count: true
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    },
    summary: statusCounts,
    data: requests
  };
};

const getAllDonations = async (query: any) => {
  const { paymentStatus, campaignId, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereCondition: any = {};

  if (paymentStatus) whereCondition.paymentStatus = paymentStatus;
  if (campaignId) whereCondition.campaignId = campaignId;

  const donations = await prisma.donation.findMany({
    where: whereCondition,
    include: {
      user: { select: { name: true, email: true } },
      campaign: { select: { title: true } }
    },
    skip,
    take: Number(limit)
  });

  const totalPaidAggregate = await prisma.donation.aggregate({
    _sum: { amount: true },
    where: { paymentStatus: "PAID" }
  });

  const total = await prisma.donation.count({ where: whereCondition });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    },
    totalRaisedAmount: totalPaidAggregate._sum.amount || 0,
    data: donations
  };
};

export const AdminService = {
  getAllUsers,
  updateUser,
  getAllRequests,
  getAllDonations
};
