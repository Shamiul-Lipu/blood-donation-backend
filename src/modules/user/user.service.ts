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

export const updateMyProfile = async (
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isAccountActive: boolean;
  },
  payload: any,
) => {
  // Split user and profile fields
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

  // Remove undefined fields (dynamic update)
  const cleanUserData = removeUndefined(userData);
  const cleanProfileData = removeUndefined(profileData);

  // console.log("Payload:", payload);
  // console.log("Clean User Data:", cleanUserData);
  // console.log("Clean Profile Data:", cleanProfileData);

  // Transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update User only if fields are provided
    if (Object.keys(cleanUserData).length > 0) {
      await tx.user.update({
        where: { email: user.email },
        data: cleanUserData,
      });
    }

    // Upsert Profile
    if (Object.keys(cleanProfileData).length > 0) {
      await tx.userProfile.upsert({
        where: { userId: user.id },
        update: cleanProfileData,
        create: {
          userId: user.id,
          bio: cleanProfileData.bio || "",
          phoneNumber: cleanProfileData.phoneNumber || "",
          age: cleanProfileData.age || 18,
          lastDonationDate: cleanProfileData.lastDonationDate || new Date(),
          ...cleanProfileData, // overwrite defaults with user-provided values
        } as Prisma.UserProfileUncheckedCreateInput,
      });
    }

    // Return updated user with profile
    return tx.user.findUnique({
      where: { email: user.email },
      include: { userProfile: true },
    });
  });

  return result;
};

const getAvailableDonors = async (query: any) => {
  // Coerce page/limit to numbers, with defaults
  const page = parseInt(query.page as string) || 1;
  const limit = Math.min(parseInt(query.limit as string) || 10, 50); // max 50
  const skip = (page - 1) * limit;

  const { bloodType, division, location } = query;

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

  const total = await prisma.user.count({ where: whereCondition });

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
