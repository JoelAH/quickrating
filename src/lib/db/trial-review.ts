import "server-only";

import TrialReviewModel, { formatTrialReview, TrialReview } from "../models/server/trial-review";
import ReviewModel from "../models/server/review";
import { Types } from "mongoose";

/**
 * Create a new trial review
 */
export const createTrialReview = async (data: {
  page: string;
  reviewer: {
    name: string;
    email: string;
    code: string;
  };
  rating?: number;
  comment: string;
}): Promise<TrialReview> => {
  const trialReview = new TrialReviewModel({
    page: new Types.ObjectId(data.page),
    reviewer: {
      name: data.reviewer.name.trim(),
      email: data.reviewer.email.trim().toLowerCase(),
      code: data.reviewer.code,
    },
    rating: data.rating,
    comment: data.comment.trim(),
    published: true, // Trial reviews are auto-published
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  const savedTrialReview = await trialReview.save();
  return formatTrialReview(savedTrialReview);
};

/**
 * Get trial review by ID and page
 */
export const getTrialReview = async (reviewId: string, pageId: string): Promise<TrialReview | null> => {
  const trialReviewDoc = await TrialReviewModel.findOne({
    _id: new Types.ObjectId(reviewId),
    page: new Types.ObjectId(pageId),
  });
  
  if (!trialReviewDoc) {
    return null;
  }
  
  return formatTrialReview(trialReviewDoc);
};

/**
 * Get all reviews for a trial page
 */
export const getTrialReviews = async (pageId: string): Promise<TrialReview[]> => {
  const trialReviewDocs = await TrialReviewModel.find({
    page: new Types.ObjectId(pageId),
    completedAt: { $exists: true },
  }).sort({ completedAt: -1 });
  
  return trialReviewDocs.map(doc => formatTrialReview(doc));
};

/**
 * Confirm trial review with verification code
 */
export const confirmTrialReview = async (
  reviewId: string,
  pageId: string,
  code: string
): Promise<boolean> => {
  const trialReviewDoc = await TrialReviewModel.findOne({
    _id: new Types.ObjectId(reviewId),
    page: new Types.ObjectId(pageId),
    "reviewer.code": code,
  });
  
  if (!trialReviewDoc) {
    return false;
  }
  
  // Set completedAt timestamp
  trialReviewDoc.completedAt = new Date();
  trialReviewDoc.updatedAt = new Date();
  await trialReviewDoc.save();
  
  return true;
};

/**
 * Migrate trial reviews to regular reviews
 */
export const migrateTrialReviewsToReviews = async (
  trialPageId: string,
  userId: string
): Promise<void> => {
  // Get all trial reviews for this page
  const trialReviews = await TrialReviewModel.find({
    page: new Types.ObjectId(trialPageId),
  });
  
  // Create regular reviews from trial reviews
  const reviewsToInsert = trialReviews.map(trialReview => ({
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
  }));
  
  if (reviewsToInsert.length > 0) {
    await ReviewModel.insertMany(reviewsToInsert);
  }
};
