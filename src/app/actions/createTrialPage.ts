"use server";

import dbConnect from "@/lib/db/db";
import { createTrialPage, isUsernameAvailable } from "@/lib/db/trial-page";
import CONSTANTS from "@/lib/constants";
import crypto from "crypto";
import { sendTrialClaimEmail } from "@/lib/models/server/email";

/**
 * Generate a unique claim token
 */
function generateClaimToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function onCreateTrialPage(prevState: any, formData: FormData): Promise<any> {
  try {
    await dbConnect();

    // Extract form data
    const username = formData.get('username')?.toString().trim().toLowerCase();
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const businessName = formData.get('businessName')?.toString().trim();
    const greeting = formData.get('greeting')?.toString().trim();
    const themeColor = formData.get('themeColor')?.toString().trim() || '#fbbc04';

    // Validation
    if (!username || !businessName) {
      return {
        error: 'Username and business name are required'
      };
    }

    // Validate username format
    const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!USERNAME_REGEX.test(username)) {
      return {
        error: 'Username must be 3-30 characters and contain only letters, numbers, hyphens, and underscores'
      };
    }

    // Validate email format if provided
    if (email) {
      const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!EMAIL_REGEX.test(email)) {
        return {
          error: 'Please enter a valid email address'
        };
      }
    }

    // Check username availability
    const available = await isUsernameAvailable(username);
    if (!available) {
      return {
        error: 'This username is already taken'
      };
    }

    // Extract contact information
    const contact = {
      mail: formData.get('mail')?.toString().trim(),
      address: formData.get('address')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim(),
      whatsapp: formData.get('whatsapp')?.toString().trim(),
      facebook: formData.get('facebook')?.toString().trim(),
      instagram: formData.get('instagram')?.toString().trim(),
      twitter: formData.get('twitter')?.toString().trim(),
      linkedin: formData.get('linkedin')?.toString().trim(),
      tiktok: formData.get('tiktok')?.toString().trim(),
    };

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CONSTANTS.trialPages.expirationDays);

    // Generate claim token if email provided
    let claimToken: string | undefined;
    let claimTokenExpiry: Date | undefined;
    if (email) {
      claimToken = generateClaimToken();
      claimTokenExpiry = new Date();
      claimTokenExpiry.setDate(claimTokenExpiry.getDate() + 30); // 30 days to claim
    }

    // Create trial page
    const trialPage = await createTrialPage({
      username,
      email,
      businessName,
      greeting,
      themeColor,
      contact,
      claimToken,
      claimTokenExpiry,
      expiresAt,
    });

    // Send claim email if email and token were provided
    if (email && claimToken) {
      const claimUrl = `https://quickrating.page/claim/${claimToken}`;
      await sendTrialClaimEmail(email, businessName, claimUrl);
    }

    return {
      success: true,
      username: trialPage.username,
      claimToken,
    };
  } catch (error: any) {
    console.error('Error creating trial page:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return {
        error: 'This username is already taken'
      };
    }
    
    return {
      error: 'Failed to create trial page. Please try again.'
    };
  }
}
