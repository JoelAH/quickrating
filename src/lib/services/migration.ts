import "server-only";

import UserModel, { User } from "../models/server/user";
import ReviewModel from "../models/server/review";
import TrialReviewModel from "../models/server/trial-review";
import { TrialPage } from "../models/server/trial-page";
import { Types } from "mongoose";

/**
 * Migrates a TrialPage to a User record
 * Creates a new User with data from the TrialPage and the Firebase UID
 * 
 * @param trialPage - The TrialPage to migrate
 * @param firebaseUid - The Firebase UID for the new User
 * @param email - The email address for the new User (may differ from trial email)
 * @returns The newly created User record
 */
export async function migrateTrialPageToUser(
  trialPage: TrialPage,
  firebaseUid: string,
  email: string
): Promise<User> {
  // Create User record with data from TrialPage
  const userData = {
    uid: firebaseUid,
    email: email,
    businessName: trialPage.businessName,
    greeting: trialPage.greeting,
    customLink: trialPage.username, // username becomes customLink
    themeColor: trialPage.themeColor,
    imageUrl: trialPage.imageUrl,
    contact: trialPage.contact,
    hits: trialPage.hits || 0,
    createdAt: trialPage.createdAt || new Date(),
    updatedAt: new Date(),
    lastSeenAt: new Date(),
  };

  const newUser = new UserModel(userData);
  await newUser.save();

  return newUser.toObject() as User;
}

/**
 * Migrates all TrialReview records to Review records
 * Updates the page reference to point to the new User ID
 * 
 * @param trialPageId - The TrialPage ID whose reviews should be migrated
 * @param userId - The new User ID to associate reviews with
 */
export async function migrateTrialReviewsToReviews(
  trialPageId: string,
  userId: string
): Promise<void> {
  // Find all TrialReviews for this TrialPage
  const trialReviews = await TrialReviewModel.find({
    page: new Types.ObjectId(trialPageId),
    completedAt: { $exists: true }, // Only migrate completed reviews
  });

  // Migrate each TrialReview to a Review
  for (const trialReview of trialReviews) {
    const reviewData = {
      page: new Types.ObjectId(userId),
      reviewer: {
        name: trialReview.reviewer.name,
        email: trialReview.reviewer.email,
        code: trialReview.reviewer.code,
      },
      rating: trialReview.rating,
      comment: trialReview.comment,
      published: trialReview.published,
      publishedAt: trialReview.publishedAt,
      completedAt: trialReview.completedAt,
      createdAt: trialReview.createdAt,
      updatedAt: new Date(),
    };

    const newReview = new ReviewModel(reviewData);
    await newReview.save();
  }
}
