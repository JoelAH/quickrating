import { TrialReview } from "./trial-review";

export type TrialPageContact = {
    address?: string;
    phone?: string;
    whatsapp?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    mail?: string;
};

export type TrialPage = {
    _id?: any;
    username: string;
    email?: string;
    businessName: string;
    greeting?: string;
    themeColor?: string;
    imageUrl?: string;
    contact?: TrialPageContact;
    claimed: boolean;
    expired: boolean;
    expiresAt: Date;
    createdAt?: Date;
    hits?: number;
};

export type TrialPageWithReviews = TrialPage & {
    reviews?: TrialReview[];
    maxedReviews?: boolean;
};

// Type guard to check if a page is a trial page
export function isTrialPage(page: any): page is TrialPageWithReviews {
    return 'username' in page && !('customLink' in page);
}
