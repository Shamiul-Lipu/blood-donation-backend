import { prisma } from "../../lib/prisma";

const createRequest = async (user: any, payload: any) => {
  if (payload.isTermsAgreed !== true) {
    throw new Error("BAD_REQUEST: Terms must be agreed");
  }
  if (user.id === payload.donorId) {
    throw new Error("BAD_REQUEST: Cannot request yourself");
  }

  const donor = await prisma.user.findUnique({
    where: { id: payload.donorId }
  });

  if (!donor || donor.isDonor !== true || donor.availability !== true) {
    throw new Error("BAD_REQUEST: Donor not available");
  }

  const newRequest = await prisma.request.create({
    data: {
      donorId: payload.donorId,
      requesterId: user.id,
      requesterName: payload.requesterName,
      requesterEmail: payload.requesterEmail,
      requesterAge: payload.requesterAge,
      requesterPhoneNumber: payload.requesterPhoneNumber,
      requesterLastDonationDate: payload.requesterLastDonationDate,
      requesterLocation: payload.requesterLocation,
      requesterDivision: payload.requesterDivision,
      requesterAddress: payload.requesterAddress,
      isTermsAgreed: payload.isTermsAgreed,
      hospitalName: payload.hospitalName,
      dateOfDonation: payload.dateOfDonation,
      hospitalAddress: payload.hospitalAddress,
      reason: payload.reason,
      requestStatus: "PENDING"
    }
  });

  return newRequest;
};

const getMyRequests = async (user: any, query: any) => {
  const { status, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereCondition: any = {
    requesterId: user.id
  };

  if (status) {
    whereCondition.requestStatus = status;
  }

  const requests = await prisma.request.findMany({
    where: whereCondition,
    skip,
    take: Number(limit),
    include: {
      donor: {
        select: {
          id: true,
          name: true,
          bloodType: true,
          location: true,
        }
      }
    }
  });

  const total = await prisma.request.count({
    where: whereCondition
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    },
    data: requests
  };
};

const getMyDonorRequests = async (user: any, query: any) => {
  if (user.isDonor !== true) {
    throw new Error("FORBIDDEN: You are not a donor");
  }

  const { status, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereCondition: any = {
    donorId: user.id
  };

  if (status) {
    whereCondition.requestStatus = status;
  }

  const requests = await prisma.request.findMany({
    where: whereCondition,
    skip,
    take: Number(limit),
    include: {
      requester: {
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

  const total = await prisma.request.count({
    where: whereCondition
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    },
    data: requests
  };
};

const updateRequestStatus = async (user: any, requestId: string, payload: any) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId }
  });

  if (!request) {
    throw new Error("NOT_FOUND: Request not found");
  }

  if (request.donorId !== user.id) {
    throw new Error("FORBIDDEN: Only the donor can update the status");
  }

  if (request.requestStatus !== "PENDING") {
    throw new Error("BAD_REQUEST: Request already processed");
  }

  const updatedRequest = await prisma.request.update({
    where: { id: requestId },
    data: { requestStatus: payload.requestStatus }
  });

  return updatedRequest;
};

export const RequestService = {
  createRequest,
  getMyRequests,
  getMyDonorRequests,
  updateRequestStatus
};
