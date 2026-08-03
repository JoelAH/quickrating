import "server-only";
import { User } from "./user";
import { Review } from "./review";

const EMAIL_URL = process.env["EMAIL_ALERT_URL"] || "";
const EMAIL_API_KEY = process.env["EMAIL_API_KEY"];
const NOTIFICATION_EMAIL = process.env["NOTIFICATION_EMAIL"] || "";
const PAGE_URL = "https://quickrating.page/auth/login";

export async function sendUserSignedUpEmail(email: string) {
    try {
        await fetch(EMAIL_URL, {
            method: "POST",
            body: JSON.stringify({
                to: NOTIFICATION_EMAIL,
                subject: "QuickRating - New Profile",
                message: `A new user completed their profile: ${email}`,
                from: {
                    name: "QuickRating Page",
                    email: "admin@quickrating.page",
                },
            }),
            headers: {
                "Content-Type": "application/json",
                "x-api-key": EMAIL_API_KEY || '',
            },
        });
    }
    catch (e) {
        console.log('Fail to send alert email');
    }
}

export async function sendReviewCode(email: string, businessName: string, code: number) {
    const res = await fetch(EMAIL_URL, {
        method: "POST",
        body: JSON.stringify({
            to: email,
            subject: "Verify Your Review",
            message: `Enter the following code to verify your review for ${businessName}: ${code}`,
            from: {
                name: "QuickRating Page",
                email: "admin@quickrating.page",
            },
        }),
        headers: {
            "Content-Type": "application/json",
            "x-api-key": EMAIL_API_KEY || '',
        },
    });

    if (!res.ok) return false;

    return true
}

export async function sendReviewEmailToBusiness(biz: User, review: Review) {
    try {
        if (EMAIL_API_KEY) {
            await fetch(EMAIL_URL, {
                method: "POST",
                body: JSON.stringify({
                    to: biz.email,
                    subject: "You got a new review!",
                    message: `Hi ${biz.businessName}, ${review.reviewer?.name} just submitted a review for you. <a href="${PAGE_URL}">Check it out.</a>`,
                    from: {
                        name: "QuickRating Page",
                        email: "admin@quickrating.page",
                    },
                }),
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": EMAIL_API_KEY,
                },
            });
        }
    } catch (e) {
        console.log("Could not email notification to admin about review", e);
    }
}

export async function sendTrialClaimEmail(email: string, businessName: string, claimUrl: string): Promise<boolean> {
    try {
        const res = await fetch(EMAIL_URL, {
            method: "POST",
            body: JSON.stringify({
                to: email,
                subject: "Claim Your QuickRating Trial Page",
                message: `Hi ${businessName},

Thank you for trying QuickRating! Your trial page is ready and you can start collecting reviews right away.

To claim your trial page and unlock more features, click the link below:
<a href="${claimUrl}">${claimUrl}</a>

This claim link will expire in 14 days. By claiming your page, you'll be able to:
• Access your dashboard to manage reviews
• Upgrade to unlimited reviews
• Keep all your existing reviews
• Customize your page further

If you have any questions, feel free to reach out to us.

Best regards,
The QuickRating Team`,
                from: {
                    name: "QuickRating Page",
                    email: "admin@quickrating.page",
                },
            }),
            headers: {
                "Content-Type": "application/json",
                "x-api-key": EMAIL_API_KEY || '',
            },
        });

        if (!res.ok) return false;

        return true;
    } catch (e) {
        console.log("Failed to send trial claim email", e);
        return false;
    }
}