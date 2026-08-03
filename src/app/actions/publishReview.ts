"use server";

import dbConnect from "@/lib/db/db";
import { getReview } from "@/lib/db/review";
import { getUserWithPayment } from "@/lib/db/user";
import { checkAuth } from "@/lib/services/middleware";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function onPublishReviewSwitch(reviewData: any, formData: FormData): Promise<any> {
    const decoded = await checkAuth();
    const id = reviewData?.id;
    const isPublished = reviewData?.isPublished;

    if (!decoded) {
        redirect('/auth/login');
    }
    if (!id) {
        return {
            error: "No id specified"
        }
    }
    await dbConnect();
    const user = await getUserWithPayment("uid", decoded.uid);
    if (!user) {
        return {
            error: 'No user found'
        }
    }

    if (!user.isSubscribed) {
        return {
            error: 'User is not permitted to update published status of reviews'
        }
    }
    const review = await getReview(id, user._id.toString());
    if (!review) {
        return {
            error: 'Review not found'
        }
    }

    review.published = !isPublished;
    if (review.published) {
        review.publishedAt = new Date();
    }
    await review.save();

    revalidatePath('/', 'layout');
}