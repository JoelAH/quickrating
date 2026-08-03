"use server";

import dbConnect from "@/lib/db/db";
import { getReviews } from "@/lib/db/review";
import { getUserWithPayment } from "@/lib/db/user";
import { sendReviewCode } from "@/lib/models/server/email";
import { isFakeEmail } from "fakefilter";
import ReviewModel from "../../lib/models/server/review";
import { normalizeEmail } from "@/lib/models/auth";

export async function onInitiateCode(prevState: any, formData: FormData): Promise<any> {
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
    const page = await getUserWithPayment("id", id);
    if (!page) {
        return {
            error: 'Please review a valid page'
        }
    }

    const pageReviews = await getReviews(id);
    if (!page.isSubscribed && pageReviews?.length >= 3) {
        return {
            error: 'This page cannot accept anymore reviews'
        }
    }

    if (page.email === email.toLowerCase()) {
        return {
            error: 'You cannot submit a review for yourself'
        }
    }

    if (pageReviews) {
        const submitterReview = pageReviews.find((r) => r.reviewer?.email === email.toLowerCase());
        if (submitterReview) {
            return {
                error: 'You have already submitted a review for this page.'
            }
        }
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const newReview = new ReviewModel({
        page: id,
        reviewer: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            code,
        },
        comment: comment.trim(),
        rating: rating || -1,
    });
    const saved = await newReview.save();

    let sent = true;
    try {
        sent = await sendReviewCode(email, page.businessName, code);
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
        id: saved._id.toString()
    };
}