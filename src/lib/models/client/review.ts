export type Review = {
    _id?: any;
    page: any;
    reviewer: {
        name: string,
        email: string,
        code?: string
    },
    comment: string;
    rating?: number;
    published?: boolean;
    publishedAt?: Date | string;
    completedAt?: Date | string;
    createdAt?: Date;
    updatedAt?: Date;
}