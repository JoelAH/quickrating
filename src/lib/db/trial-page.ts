import "server-only";

import TrialPageModel, { formatTrialPage, TrialPage } from "../models/server/trial-page";
import UserModel from "../models/server/user";
import { TrialReview } from "../models/server/trial-review";
import { Types } from "mongoose";
import CONSTANTS from "../constants";

/**
 * Check if username is available across both User and TrialPage collections
 */
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const normalizedUsername = username.trim().toLowerCase();
  
  // Check User collection (customLink field)
  const userDoc = await UserModel.findOne({ customLink: normalizedUsername });
  if (userDoc) {
    return false;
  }
  
  // Check TrialPage collection (username field)
  const trialPageDoc = await TrialPageModel.findOne({ username: normalizedUsername });
  if (trialPageDoc) {
    return false;
  }
  
  return true;
};

/**
 * Create a new trial page
 */
export const createTrialPage = async (data: {
  username: string;
  email?: string;
  businessName: string;
  greeting?: string;
  themeColor?: string;
  imageUrl?: string;
  contact?: {
    address?: string;
    phone?: string;
    whatsapp?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    mail?: string;
  };
  claimToken?: string;
  claimTokenExpiry?: Date;
  expiresAt: Date;
}): Promise<TrialPage> => {
  const trialPage = new TrialPageModel({
    username: data.username.trim().toLowerCase(),
    email: data.email?.trim().toLowerCase(),
    businessName: data.businessName.trim(),
    greeting: data.greeting?.trim(),
    themeColor: data.themeColor?.trim(),
    imageUrl: data.imageUrl?.trim(),
    contact: data.contact,
    claimToken: data.claimToken,
    claimTokenExpiry: data.claimTokenExpiry,
    expiresAt: data.expiresAt,
    claimed: false,
    expired: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  const savedTrialPage = await trialPage.save();
  return formatTrialPage(savedTrialPage);
};

/**
 * Get trial page by username
 */
export const getTrialPage = async (username: string): Promise<TrialPage | null> => {
  const trialPageDoc = await TrialPageModel.findOne({ 
    username: username.trim().toLowerCase() 
  });
  
  if (!trialPageDoc) {
    return null;
  }
  
  return formatTrialPage(trialPageDoc);
};

/**
 * Get trial page with reviews (for public display)
 */
export const getTrialPageWithReviews = async (username: string): Promise<(TrialPage & { reviews?: TrialReview[]; maxedReviews?: boolean }) | null> => {
  const [result] = await TrialPageModel.aggregate<TrialPage & { reviews?: TrialReview[] }>([
    {
      $match: {
        username: username.trim().toLowerCase(),
      },
    },
    {
      $lookup: {
        localField: "_id",
        from: "trialreviews",
        foreignField: "page",
        as: "reviews",
        pipeline: [
          {
            $match: {
              publishedAt: { $exists: true },
              completedAt: { $exists: true },
              published: true,
            },
          },
          {
            $project: {
              _id: {
                $toString: "$_id",
              },
              rating: 1,
              "reviewer.name": 1,
              comment: 1,
              completedAt: {
                $dateToString: {
                  date: "$completedAt",
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                },
              },
            },
          },
          { $sort: { completedAt: -1 } },
        ],
      },
    },
    {
      $project: {
        _id: {
          $toString: "$_id",
        },
        username: 1,
        businessName: 1,
        greeting: 1,
        themeColor: 1,
        imageUrl: 1,
        contact: 1,
        claimed: 1,
        expired: 1,
        expiresAt: 1,
        reviews: 1,
      },
    },
  ]);
  
  if (!result) {
    return null;
  }
  
  // Trial pages have a maximum number of reviews
  let maxedReviews = false;
  if (result.reviews && result.reviews.length >= CONSTANTS.trialPages.maxReviews) {
    maxedReviews = true;
    result.reviews = result.reviews.slice(0, CONSTANTS.trialPages.maxReviews);
  }
  
  return {
    ...result,
    maxedReviews,
  };
};

/**
 * Get trial page by claim token
 */
export const getTrialPageByToken = async (token: string): Promise<TrialPage | null> => {
  const trialPageDoc = await TrialPageModel.findOne({ 
    claimToken: token 
  });
  
  if (!trialPageDoc) {
    return null;
  }
  
  return formatTrialPage(trialPageDoc);
};

/**
 * Mark trial page as claimed
 */
export const markTrialPageClaimed = async (trialPageId: string, userId: string): Promise<void> => {
  await TrialPageModel.updateOne(
    { _id: new Types.ObjectId(trialPageId) },
    {
      $set: {
        claimed: true,
        claimedBy: new Types.ObjectId(userId),
        claimedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );
};

/**
 * Mark trial page as expired
 */
export const markTrialPageExpired = async (trialPageId: string): Promise<void> => {
  await TrialPageModel.updateOne(
    { _id: new Types.ObjectId(trialPageId) },
    {
      $set: {
        expired: true,
        updatedAt: new Date(),
      },
    }
  );
};

/**
 * Update trial page hit counter
 */
export const updateTrialPageHit = async (username: string): Promise<void> => {
  try {
    await TrialPageModel.updateOne(
      { username: username.trim().toLowerCase() },
      { $inc: { hits: 1 } }
    );
  } catch (e) {
    console.log(JSON.stringify(e));
  }
};
