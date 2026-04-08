import { prisma } from "../../lib/prisma";

const createDonation = async (user: any, payload: any) => {
  const { campaignId, amount } = payload;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId }
  });

  if (!campaign) {
    throw new Error("NOT_FOUND: Campaign not found");
  }

  if (new Date(campaign.deadline) < new Date()) {
    throw new Error("BAD_REQUEST: Campaign has ended");
  }

  const newDonation = await prisma.donation.create({
    data: {
      userId: user.id,
      campaignId,
      amount,
      paymentStatus: "PENDING"
    }
  });

  return newDonation;
};

const getMyDonations = async (user: any, query: any) => {
  const { paymentStatus } = query;

  const whereCondition: any = {
    userId: user.id
  };

  if (paymentStatus) {
    whereCondition.paymentStatus = paymentStatus;
  }

  const donations = await prisma.donation.findMany({
    where: whereCondition,
    include: {
      campaign: {
        select: {
          title: true,
          deadline: true
        }
      }
    }
  });

  const totalPaid = await prisma.donation.aggregate({
    _sum: { amount: true },
    where: {
      userId: user.id,
      paymentStatus: "PAID"
    }
  });

  return {
    donations,
    totalAmountDonated: totalPaid._sum.amount || 0
  };
};

const initPayment = async (user: any, donationId: string) => {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId }
  });

  if (!donation) {
    throw new Error("NOT_FOUND: Donation not found");
  }

  if (donation.userId !== user.id) {
    throw new Error("FORBIDDEN: You do not own this donation");
  }

  if (donation.paymentStatus !== "PENDING") {
    throw new Error("BAD_REQUEST: Already paid or failed");
  }

  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  await prisma.donation.update({
    where: { id: donationId },
    data: { transactionId }
  });

  // Mocking payment gateway init
  const paymentUrl = `https://mock-payment-gateway.com/pay?txn=${transactionId}`;

  return {
    paymentUrl,
    transactionId
  };
};

const verifyPayment = async (transactionId: string, status: string) => {
  const donation = await prisma.donation.findUnique({
    where: { transactionId }
  });

  if (!donation) {
    throw new Error("NOT_FOUND: Donation not found");
  }

  if (status === "SUCCESS" || status === "VALID") {
    await prisma.$transaction([
      prisma.donation.update({
        where: { id: donation.id },
        data: { paymentStatus: "PAID" }
      }),
      prisma.campaign.update({
        where: { id: donation.campaignId },
        data: { raisedAmount: { increment: donation.amount } }
      })
    ]);
    return true; 
  } else {
    await prisma.donation.update({
      where: { id: donation.id },
      data: { paymentStatus: "FAILED" }
    });
    return false;
  }
};

export const DonationService = {
  createDonation,
  getMyDonations,
  initPayment,
  verifyPayment
};
