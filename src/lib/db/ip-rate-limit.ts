import "server-only";

import IPRateLimitModel, { IPRateLimit } from "../models/server/ip-rate-limit";
import CONSTANTS from "../constants";

/**
 * Check if IP address can create a trial page
 * Returns allowed status and remaining attempts
 */
export const canCreateTrialPage = async (
  ipAddress: string
): Promise<{ allowed: boolean; remainingAttempts: number }> => {
  const now = new Date();
  
  // Find existing rate limit record for this IP
  const rateLimitDoc = await IPRateLimitModel.findOne({
    ipAddress,
    expiresAt: { $gt: now }, // Only consider non-expired records
  });
  
  // If no record exists, IP can create trial page
  if (!rateLimitDoc) {
    return {
      allowed: true,
      remainingAttempts: CONSTANTS.trialPages.rateLimit.maxAttempts,
    };
  }
  
  // Check if IP has exceeded the limit
  const maxAttempts = CONSTANTS.trialPages.rateLimit.maxAttempts;
  const allowed = rateLimitDoc.attempts < maxAttempts;
  const remainingAttempts = Math.max(0, maxAttempts - rateLimitDoc.attempts);
  
  return {
    allowed,
    remainingAttempts,
  };
};

/**
 * Record a trial page creation attempt for an IP address
 */
export const recordTrialPageAttempt = async (ipAddress: string): Promise<void> => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CONSTANTS.trialPages.rateLimit.windowHours * 60 * 60 * 1000);
  
  // Try to find existing rate limit record for this IP
  const existingRecord = await IPRateLimitModel.findOne({
    ipAddress,
    expiresAt: { $gt: now }, // Only consider non-expired records
  });
  
  if (existingRecord) {
    // Update existing record
    await IPRateLimitModel.updateOne(
      { _id: existingRecord._id },
      {
        $inc: { attempts: 1 },
        $set: { lastAttemptAt: now },
      }
    );
  } else {
    // Create new record
    const rateLimitRecord = new IPRateLimitModel({
      ipAddress,
      attempts: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
      expiresAt,
    });
    
    await rateLimitRecord.save();
  }
};
