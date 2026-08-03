import "server-only";

import { isSubcriptionValid, Payment } from "../models/server/payment";
import { User } from "../models/server/user";
import UserModel from "../models/server/user";
import { Review } from "../models/server/review";
import { Types } from "mongoose";
import TrialPageModel from "../models/server/trial-page";

enum OperartionType {
    CREATE = "create",
    UPDATE = "update"
}

export const getUserWithPayment = async (type: string, id: string) => {
    const match = type === "id" ?
    {
      _id: new Types.ObjectId(id as string),
    } :
    {
      uid: id as string,
    };
    const [sessionUserDoc] = await UserModel.aggregate<User & { payments?: Payment[] }>([
        {
            $match: match,
        },
        {
            "$lookup": {
                localField: "_id",
                from: "payments",
                foreignField: "user",
                as: "payments",
                pipeline: [
                    {
                        $project: {
                            _id: {
                                $toString: "$_id",
                            },
                            status: 1,
                            cancelled: 1,
                            renewsAt: {
                                $dateToString: {
                                    date: "$renewsAt",
                                    format: "%Y-%m-%dT%H:%M:%S.%LZ",
                                },
                            },
                            endsAt: {
                                $dateToString: {
                                    date: "$endsAt",
                                    format: "%Y-%m-%dT%H:%M:%S.%LZ",
                                },
                            },
                            isTemp: 1,
                            tempAt: 1,
                            tempCode: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                _id: {
                    $toString: "$_id",
                },
                uid: 1,
                businessName: 1,
                email: 1,
                greeting: 1,
                customLink: 1,
                themeColor: 1,
                imageUrl: 1,
                contact: 1,
                payments: 1,
            },
        },
    ]);

    if (!sessionUserDoc) {
        return null;
    }

    let isSubscribed = false;
    let validPayment;
    for (const pay of (sessionUserDoc.payments || [])) {
        if (isSubcriptionValid(pay)) {
            isSubscribed = true;
            validPayment = pay;
            break;
        }
    }
    const { payments, ...user } = sessionUserDoc;
    const res: User & { isSubscribed: boolean } & { payment?: Payment } = {
        ...user,
        isSubscribed,
    };
    if (isSubscribed && validPayment) {
        res.payment = validPayment;
    }

    return res;
};

export const getUser = async (uid: string) => {
    return await UserModel.findOne({ uid });
}

export const isCustomLinkExists = async (username: string) => {
    let isExist = false;
    const normalizedUsername = username.trim().toLowerCase();
    
    // Check User collection (customLink field)
    const userDoc = await UserModel.findOne({ customLink: normalizedUsername });
    if (userDoc) {
        isExist = true;
    }
    
    // Check TrialPage collection (username field) to prevent conflicts
    if (!isExist) {
        const trialPageDoc = await TrialPageModel.findOne({ username: normalizedUsername });
        if (trialPageDoc) {
            isExist = true;
        }
    }

    return { isExist };
}

export const getReviewPage = async (username: string) => {
    const [result] = await UserModel.aggregate<User & { reviews?: Review[] } & { payments?: Payment[] }>([
        {
            $match: {
                customLink: (username as string).trim().toLowerCase(),
            },
        },
        {
            "$lookup": {
                localField: "_id",
                from: "reviews",
                foreignField: "page",
                as: "reviews",
                pipeline: [
                    {
                        $match: {
                            publishedAt: { $exists: true },
                            completedAt: { $exists: true },
                            published: true,
                        },
                    },
                    {
                        $project: {
                            "_id": {
                                $toString: "$_id",
                            },
                            "rating": 1,
                            "reviewer.name": 1,
                            "comment": 1,
                            "completedAt": {
                                $dateToString: {
                                    date: "$completedAt",
                                    format: "%Y-%m-%dT%H:%M:%S.%LZ",
                                },
                            },
                        },
                    },
                    { $sort: { completedAt: -1 } },
                ],
            },
        },
        {
            "$lookup": {
                localField: "_id",
                from: "payments",
                foreignField: "user",
                as: "payments",
                pipeline: [
                    {
                        $project: {
                            _id: {
                                $toString: "$_id",
                            },
                            status: 1,
                            cancelled: 1,
                            renewsAt: 1,
                            endsAt: 1,
                            isTemp: 1,
                            tempAt: 1,
                            tempCode: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                _id: {
                    $toString: "$_id",
                },
                businessName: 1,
                greeting: 1,
                customLink: 1,
                themeColor: 1,
                imageUrl: 1,
                contact: 1,
                reviews: 1,
                payments: 1,
            },
        },
    ]);

    if (!result) return null;

    let isSubscribed = false;
    for (const pay of (result.payments || [])) {
        if (isSubcriptionValid(pay)) {
            isSubscribed = true;
            break;
        }
    }

    let maxedReviews = false;
    if (!isSubscribed && (result.reviews?.length && result.reviews.length >= 3)) {
        maxedReviews = true;
        result.reviews = result.reviews.slice(-3);
    }

    const returned = {
        ...result,
        isSubscribed,
        maxedReviews,
    };

    return returned;
}

export const updateHit = async (username: string) => {
    try {
        await UserModel.updateOne({ customLink: (username as string).trim().toLowerCase() }, { $inc: { hits: 1 } });
    } catch(e) {
        console.log(JSON.stringify(e));
    }
}