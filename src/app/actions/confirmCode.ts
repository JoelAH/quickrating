"use server";

import CONSTANTS from "@/lib/constants";
import dbConnect from "@/lib/db/db";
import { getUserWithPayment } from "@/lib/db/user";
import { sendReviewEmailToBusiness } from "@/lib/models/server/email";
import ReviewModel from "../../lib/models/server/review";
import { Types } from "mongoose";

export async function onConfirmCode(prevState: any, formData: FormData): Promise<any> {
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
            error: 'No code provided. Please verification code.'
        }
    }

    await dbConnect();

    const review = await ReviewModel.findOne({
        "_id": new Types.ObjectId(reviewId),
        "page": new Types.ObjectId(pageId),
        "completedAt": { "$exists": false },
        "reviewer.code": confirmCode.trim(),
    });

    if (!review) {
        return {
            error: 'You have not entered a valid code to submit this review.'
        }
    }

    const page = await getUserWithPayment("id", pageId);
    if (!page) {
        return {
            error: 'The page to be reviewed was not found'
        }
    }

    // Recheck at confirmation: several customers may have requested codes before the cap.
    if (!page.isSubscribed) {
        const completedCount = await ReviewModel.countDocuments({
            page: new Types.ObjectId(pageId),
            completedAt: { $exists: true },
        });
        if (completedCount >= CONSTANTS.freeReviewLimit) {
            return { error: 'This page has reached its free review allowance.' };
        }
    }

    // send email to business
    if (page.isSubscribed) {
        await sendReviewEmailToBusiness(page, review);
    }

    if (!page.isSubscribed) {
        review.published = true;
        review.publishedAt = new Date();
    }
    review.completedAt = new Date();
    await review.save();

    return {
        message: 'Review saved',
        success: true
    };
}