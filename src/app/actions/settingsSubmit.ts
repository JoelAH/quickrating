"use server";

import { isPageBackground, normalizePageBackground } from "@/lib/pageBackgrounds";
import dbConnect from "@/lib/db/db";
import { getUser, isCustomLinkExists } from "@/lib/db/user";
import UserModel from "../../lib/models/server/user";
import { checkAuth } from "@/lib/services/middleware";
import { redirect } from "next/navigation";
import { PageContact } from "@/lib/models/server/page-setting";
import { sendUserSignedUpEmail } from "@/lib/models/server/email";
import { revalidatePath } from "next/cache";

const socialInputs: { name: string }[] = [
    { name: 'mail' },
    { name: 'address' },
    { name: 'phone' },
    { name: 'whatsapp' },
    { name: 'facebook' },
    { name: 'instagram' },
    { name: 'twitter' },
    { name: 'linkedin' },
    { name: 'tiktok' }
]

export async function onServerSubmit(prevState: any, formData: FormData): Promise<any> {
    const decoded = await checkAuth();
    await dbConnect();

    const businessName = formData.get('buisnessName');
    const customLink = formData.get('username');
    const greeting = formData.get('greeting');
    const color = formData.get('color');
    const imgUrl = formData.get('logoUrl');
    const requestedBackground = formData.get('pageBackground');

    const socialData: PageContact = {};
    socialInputs.map(social => {
        const data = formData.get(social.name);
        if (data) {
            socialData[social.name as keyof PageContact] = data.toString();
        }
    })

    if (!decoded) {
        redirect('/auth/login');
    }

    const errors: string[] = [];
    if (!businessName?.toString().trim()) {
        errors.push('No business name provided')
    }
    if (!customLink?.toString().trim()) {
        errors.push('No custum username provided')
    }
    if (!/^[a-zA-Z0-9]+$/.test(customLink?.toString().trim() || '')) {
        errors.push('Custom username is not alpha-numeric')
    }

    const user = await getUser(decoded.uid);
    const isUpdate = !!user;
    if (requestedBackground !== null && !isPageBackground(requestedBackground)) {
        errors.push('Choose one of the available page backgrounds.');
    }
    const pageBackground = normalizePageBackground(requestedBackground ?? user?.pageBackground);

    if (!isUpdate && customLink?.toString().trim()) {
        const existRes = await isCustomLinkExists(customLink?.toString() || '');
        if (existRes.isExist) {
            errors.push('Custom username is already taken');
        }
    }

    // process errors
    if (errors.length) {
        return { 
            errors
        };
    }

    if (!isUpdate) {
        const newUser = new UserModel({
            uid: decoded.uid,
            email: decoded.email,
            businessName: businessName?.toString().trim(),
            greeting: greeting?.toString().trim() || "",
            customLink: customLink?.toString().trim().toLowerCase(),
            imageUrl: imgUrl?.toString() || undefined,
            themeColor: color && /^#[a-fA-F0-9]+$/.test(color.toString()) ? color.toString() : "#fbbc04",
            contact: socialData,
            pageBackground,
        });
        await newUser.save();
        decoded?.email && await sendUserSignedUpEmail(decoded.email);
    } else {
        // UPDATE
        if (customLink?.toString().trim() !== user.customLink) {
            const existRes = await isCustomLinkExists(customLink?.toString() || '')
            if (existRes.isExist) {
                return {
                    errors: ['Custom username is already taken']
                }
            }
        }

        user.businessName = businessName?.toString().trim() || "";
        user.greeting = greeting?.toString().trim() || "";
        user.customLink = customLink?.toString().trim().toLowerCase() || "";
        user.themeColor = color && /^#[a-fA-F0-9]+$/.test(color.toString()) ? color.toString() : "#fbbc04";
        user.contact = socialData || undefined;
        user.pageBackground = pageBackground;
        if (imgUrl?.toString()) {
            user.imageUrl = imgUrl.toString();
        }
        await user.save();
    }

    revalidatePath('/', 'layout');

    if (isUpdate) {
        return {
            message: 'Profile Updated'
        };
    }
    redirect('/main/dashboard');
}