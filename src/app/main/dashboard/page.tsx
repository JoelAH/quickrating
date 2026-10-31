import DashboardView from "@/components/dashboardView";
import dbConnect from "@/lib/db/db";
import { getReviews } from "@/lib/db/review";
import { getUserWithPayment } from "@/lib/db/user";
import { checkAuth } from "@/lib/services/middleware";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } };

export default async function Page() {
    const userClaims = await checkAuth();
    await dbConnect();

    const user = await getUserWithPayment("uid", userClaims?.uid || '');
    if (!user) {
        return redirect('/main/setup');
    }
    const reviews = await getReviews(user._id.toString());

    return <DashboardView user={user} reviews={reviews} />;
}
