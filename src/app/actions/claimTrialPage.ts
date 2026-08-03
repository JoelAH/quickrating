"use server";

import { auth } from "firebase-admin";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db/db";
import { getTrialPageByToken, markTrialPageClaimed } from "@/lib/db/trial-page";
import { migrateTrialPageToUser, migrateTrialReviewsToReviews } from "@/lib/services/migration";
import { initAdminApp } from "@/lib/firebase/admin.config";
import CONSTANTS from "@/lib/constants";
import { normalizeEmail } from "@/lib/models/auth";
import { isFakeEmail } from "fakefilter";

export async function onClaimTrialPage(prevState: any, formData: FormData): Promise<any> {
  const token = formData.get('token')?.toString();
  let email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const idToken = formData.get('idToken')?.toString(); // Firebase ID token from client-side auth

  // Validate required fields
  if (!token) {
    return {
      error: 'Claim token is required'
    };
  }

  if (!idToken) {
    return {
      error: 'Authentication token is required'
    };
  }

  // Initialize Firebase Admin
  initAdminApp();

  // Verify the ID token first
  let decodedToken;
  try {
    decodedToken = await auth().verifyIdToken(idToken);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return {
      error: 'Invalid authentication token. Please try again.'
    };
  }

  const firebaseUid = decodedToken.uid;
  const userEmail = decodedToken.email || email;

  if (!userEmail) {
    return {
      error: 'Email address is required'
    };
  }

  // Connect to database
  await dbConnect();

  // Get trial page by token
  const trialPage = await getTrialPageByToken(token);
  
  if (!trialPage) {
    return {
      error: 'This claim link is invalid or has expired.'
    };
  }

  // Check if token has expired
  if (trialPage.claimTokenExpiry && new Date() > new Date(trialPage.claimTokenExpiry)) {
    return {
      error: 'This claim link has expired.'
    };
  }

  // Check if already claimed
  if (trialPage.claimed) {
    return {
      error: 'This trial page has already been claimed.'
    };
  }

  try {
    // Migrate TrialPage to User
    const newUser = await migrateTrialPageToUser(trialPage, firebaseUid, userEmail);

    // Migrate TrialReviews to Reviews
    await migrateTrialReviewsToReviews(trialPage._id!, newUser._id!.toString());

    // Mark TrialPage as claimed
    await markTrialPageClaimed(trialPage._id!, newUser._id!.toString());

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth().createSessionCookie(idToken, {
      expiresIn,
    });
    
    const options = {
      name: CONSTANTS.sessionCookieName,
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };
    
    // Set the session cookie
    cookies().set(options);

    return {
      success: true,
      redirectUrl: '/main/dashboard'
    };

  } catch (error) {
    console.error('Error claiming trial page:', error);
    return {
      error: 'Unable to complete claim process. Please contact support.'
    };
  }
}
