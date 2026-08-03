export type TrialReview = {
    _id?: any;
    page: any;
    reviewer: {
        name: string;
        email: string;
    };
    rating?: number;
    comment: string;
    published: boolean;
    publishedAt?: Date | string;
    completedAt?: Date | string;
    createdAt?: Date;
    updatedAt?: Date;
};
