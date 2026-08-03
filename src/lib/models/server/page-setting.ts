import "server-only";

export type PageContact = {
    address?: string;
    phone?: string;
    whatsapp?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    mail?: string;
}
export type PageSettings = {
    businessName: string;
    greeting?: string;
    customLink: string;
    themeColor?: string;
    imageUrl?: string;
    contact?: PageContact
}
