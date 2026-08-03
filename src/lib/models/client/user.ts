import { Review } from "./review";

export type Payment = {
    tier?: string,
    status?: string,
    cancelled?: boolean,
    renewsAt?: Date,
    endsAt?: Date,
}

export type PageContact =  {
    address?: string
    phone?: string,
    whatsapp?: string,
    facebook?: string,
    twitter?: string,
    instagram?: string,
    tiktok?: string,
    linkedin?: string,
    mail?: string
};

export type User = {
    _id?: any;
    uid: string,
    email: string,
    businessName: string,
    greeting?: string,
    customLink: string,
    themeColor?: string,
    imageUrl?: string,
    contact?: PageContact,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
    lastSeenAt?: Date,
    isSubscribed?: boolean,
    payment?: Payment,
    reviews?: Review[]
}