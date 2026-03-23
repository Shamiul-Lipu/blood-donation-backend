import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { removeUndefined } from "../../utils/removeUndefined";

const getMyProfile = async (user: any, sesssion?: any) => {
  const result = await prisma.user.findUnique({
    where: { email: user.email },
    include: { userProfile: true },
  });

  return result;
};

const updateMyProfile = async (
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isAccountActive: boolean;
  },
  payload: any,
) => {
  // Split user + profile fields

  const userData = {
    name: payload.name,
    profileImage: payload.profileImage,
    availability: payload.availability,
    isDonor: payload.isDonor,
    location: payload.location,
    division: payload.division,
    address: payload.address,
  };

  const profileData = {
    bio: payload.bio,
    phoneNumber: payload.phoneNumber,
    age: payload.age,
    lastDonationDate: payload.lastDonationDate,
  };

  // Remove undefined fields
  const cleanUserData = removeUndefined(userData);
  const cleanProfileData = removeUndefined(profileData);

  console.log(payload);
  console.log({ cleanUserData });
  console.log({ cleanProfileData });

  // Transaction (VERY IMPORTANT)
  const result = await prisma.$transaction(async (tx) => {
    // Update User
    await tx.user.update({
      where: { email: user.email },
      data: cleanUserData,
    });

    // Upsert Profile
    await tx.userProfile.upsert({
      where: { userId: user.id },
      update: cleanProfileData,
      create: {
        userId: user.id,
        ...cleanProfileData,
      } as Prisma.UserProfileUncheckedCreateInput,
    });

    // Return updated user
    const updatedUser = await tx.user.findUnique({
      where: { email: user.email },
      include: {
        userProfile: true,
      },
    });

    return updatedUser;
  });

  return result;
};

const getAvailableDonors = async (query: any) => {
  const { bloodType, division, location, page, limit } = query;

  const skip = (page - 1) * limit;

  const whereCondition: any = {
    isDonor: true,
    availability: true,
    isAccountActive: true,
  };

  if (bloodType) whereCondition.bloodType = bloodType;

  if (division) whereCondition.division = division;

  if (location) whereCondition.location = location;

  const donors = await prisma.user.findMany({
    where: whereCondition,

    skip,
    take: limit,

    select: {
      id: true,
      name: true,
      bloodType: true,
      location: true,
      division: true,
      availability: true,

      userProfile: {
        select: {
          bio: true,
          age: true,
          lastDonationDate: true,
        },
      },
    },
  });

  const total = await prisma.user.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },

    data: donors,
  };
};

export const UserService = {
  getMyProfile,
  updateMyProfile,
  getAvailableDonors,
};
