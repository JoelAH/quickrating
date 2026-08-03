"use server";

import dbConnect from "@/lib/db/db";
import { getUserWithPayment } from "@/lib/db/user";
import { checkAuth } from "@/lib/services/middleware";
import { redirect } from "next/navigation";
import PaymentModel from "../../lib/models/server/payment";
import { revalidatePath } from "next/cache";
import { cancelPaymentSubscription } from "@/lib/db/payment";

export async function cancelSubscription() {
    const decoded = await checkAuth();
    if (!decoded) {
        redirect('/auth/login');
    }
    await dbConnect();
    const user = await getUserWithPayment("uid", decoded.uid);
    const payments = await PaymentModel.find({ uid: decoded.uid, cancelled: false });

    if (!payments?.length) {
        return {
            error: 'No subscription available'
        }
    }

    for (const payment of payments) {
        const res = await cancelPaymentSubscription(payment.subscriptionId);
        await PaymentModel.updateOne({ _id: payment._id }, { cancelled: true, endsAt: new Date(payment.renewsAt || new Date()) });
      }

    revalidatePath('/', 'layout');
}