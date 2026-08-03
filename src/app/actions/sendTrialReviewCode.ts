"use server";

import dbConnect from "@/lib/db/db";
import { createTrialReview, getTrialReviews } from "@/lib/db/trial-review";
import { sendReviewCode } from "@/lib/models/server/email";
import { isFakeEmail } from "fakefilter";
import { normalizeEmail } from "@/lib/models/auth";
import TrialPageModel from "@/lib/models/server/trial-page";
import { Types } from "mongoose";
import CONSTANTS from "@/lib/constants";

export async function onSendTrialReviewCode(prevState: any, formData: FormData): Promise<any> {
    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString();
    const rating = Number(formData.get('rating')?.toString() || 0);
    const comment = formData.get('comment')?.toString();
    let email = formData.get('email')?.toString();

    if (!id) {
        return {
            error: 'Please review a valid page'
        }
    }

    if (!name || !email || !comment) {
        return {
            error: 'Please provide a valid name, email and comment'
        }
    }
    
    if (isFakeEmail(email)) {
        return {
            error: 'Please enter a valid email address'
        }
    }

    email = normalizeEmail(email);
    await dbConnect();
    
    // Get trial page by ID (id is the trial page _id from the form)
    const trialPageDoc = await TrialPageModel.findById(new Types.ObjectId(id));
    if (!trialPageDoc) {
        return {
            error: 'Please review a valid page'
        }
    }
    
    const trialPage = {
        _id: trialPageDoc._id.toString(),
        username: trialPageDoc.username,
        businessName: trialPageDoc.businessName,
        expired: trialPageDoc.expired,
        expiresAt: trialPageDoc.expiresAt,
    };

    // Check if trial page is expired
    if (trialPage.expired || new Date() > new Date(trialPage.expiresAt)) {
        return {
            error: 'This trial page has expired. Please contact the business owner.'
        }
    }

    // Get existing reviews for this trial page
    const pageReviews = await getTrialReviews(trialPage._id!);
    
    // Check review limit for trial pages
    if (pageReviews.length >= CONSTANTS.trialPages.maxReviews) {
        return {
            error: `This trial page has reached its maximum of ${CONSTANTS.trialPages.maxReviews} reviews`
        }
    }

    // Check if reviewer hasn't already submitted
    const submitterReview = pageReviews.find((r) => r.reviewer?.email === email.toLowerCase());
    if (submitterReview) {
        return {
            error: 'You have already submitted a review for this page.'
        }
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create TrialReview with published: true and publishedAt: now
    const savedReview = await createTrialReview({
        page: trialPage._id!,
        reviewer: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            code,
        },
        comment: comment.trim(),
        rating: rating || -1,
    });

    // Send verification code email
    let sent = true;
    try {
        sent = await sendReviewCode(email, trialPage.businessName, Number(code));
    }
    catch (e) {
        console.log(e);
        sent = false;
    }

    if (!sent) {
        return {
            error: 'Error sending code to email'
        }
    }

    return {
        message: 'Email sent',
        success: true,
        id: savedReview._id?.toString()
    };
}
