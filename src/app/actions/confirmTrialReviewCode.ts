"use server";

import dbConnect from "@/lib/db/db";
import { confirmTrialReview } from "@/lib/db/trial-review";

export async function onConfirmTrialReviewCode(prevState: any, formData: FormData): Promise<any> {
    const pageId = formData.get('pageId')?.toString();
    const reviewId = formData.get('reviewId')?.toString();
    const confirmCode = formData.get('confirmCode')?.toString();

    if (!reviewId) {
        return {
            error: 'Invalid review'
        }
    }

    if (!pageId) {
        return {
            error: 'Please review a valid page'
        }
    }

    if (!confirmCode) {
        return {
            error: 'No code provided. Please enter verification code.'
        }
    }

    await dbConnect();

    // Validate code matches TrialReview and set completedAt timestamp
    const confirmed = await confirmTrialReview(reviewId, pageId, confirmCode.trim());

    if (!confirmed) {
        return {
            error: 'You have not entered a valid code to submit this review.'
        }
    }

    return {
        message: 'Review saved',
        success: true
    };
}
