import "server-only";

import ReviewModel, { formatReview, Review } from "../models/server/review";
import { Types } from "mongoose";

export const getReviews = async (userId: string) => {
    const reviews =  await ReviewModel.aggregate<Review>([
        {
            $match: {
                page: new Types.ObjectId(userId),
                completedAt: { $exists: true },
            },
        },
        {
            $project: {
                "_id": {
                    $toString: "$_id",
                },
                "page": {
                    $toString: "$page",
                },
                "rating": 1,
                "reviewer.name": 1,
                "comment": 1,
                "published": 1,
                "completedAt": {
                    $dateToString: {
                        date: "$completedAt",
                        format: "%Y-%m-%dT%H:%M:%S.%LZ",
                    },
                },
                "publishedAt": {
                    $dateToString: {
                        date: "$publishedAt",
                        format: "%Y-%m-%dT%H:%M:%S.%LZ",
                    },
                },
            },
        },
        { $sort: { completedAt: -1 } },
    ]);
    return reviews.map(review => formatReview(review));
}

export const getReview = async (id: string, profileId: string) => {
    return ReviewModel.findOne({
        _id: new Types.ObjectId(id),
        page: new Types.ObjectId(profileId),
        completedAt: {$exists: true},
    })
}