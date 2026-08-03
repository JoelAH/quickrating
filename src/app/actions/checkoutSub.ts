"use server";

import dbConnect from "@/lib/db/db";
import { getSubscriptionURL } from "@/lib/db/payment";
import { getUserWithPayment } from "@/lib/db/user";
import { addMonths } from "@/lib/models/server/payment";
import { checkAuth } from "@/lib/services/middleware";
import { redirect } from "next/navigation";
import PaymentModel from "../../lib/models/server/payment";

export async function checkoutSubscription() {
    const decoded = await checkAuth();
    if (!decoded) {
        redirect('/auth/login');
    }
    await dbConnect();
    const user = await getUserWithPayment("uid", decoded.uid);
    if (!user || user.isSubscribed) {
        return {
            error: 'You already have a subscription'
        }
    }

    // make call
    const code = Math.floor(100000 + Math.random() * 900000);
    const result = await getSubscriptionURL(decoded.uid, user._id.toString(), code);
    if (!result) {
        return {
            error: 'Somehting went wrong. Please try again later'
        }
    }

    const newPayment = new PaymentModel({
        user: user._id,
        uid: decoded.uid,
        tier: 'Standard',
        subscriptionId: "temp",
        status: "active",
        cancelled: false,
        isTemp: true,
        tempCode: code,
        renewsAt: addMonths(1, new Date(), true),
      });
      await newPayment.save();
      redirect(result.data.attributes.url);
}