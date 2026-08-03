import BizPage from "@/components/bizpage";
import Header from "@/components/header";
import dbConnect from "@/lib/db/db";
import { getReviews } from "@/lib/db/review";
import { getUserWithPayment } from "@/lib/db/user";
import { checkAuth } from "@/lib/services/middleware";
import { Grid } from "@mui/material";
import { redirect } from "next/navigation";
import classes from './dashboard.module.scss';
import Copy from "@/components/copy";
import Link from "next/link";
import SubscriptionContent from "@/components/subscriptioncontent";
import ReviewsContent from "@/components/reviewsContent";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Metadata } from "next";
import { getMetaDataObject } from "@/lib/util";

export const metadata: Metadata = getMetaDataObject(
    'Dashboard',
    'Update your page & manage reviews'
);

export default async function Page() {
    const userClaims = await checkAuth();
    await dbConnect();

    const user = await getUserWithPayment("uid", userClaims?.uid || '');
    if (!user) {
        return redirect('/main/setup');
    }
    const reviews = await getReviews(user._id.toString());

    return (
        <>
            <Header />
            <BizPage biz={user} />
            <Grid container spacing={3} sx={{ marginTop: 10, textAlign: 'center' }}>
                <Grid item xs={12} md={6}>
                    <div className={classes.cardContainer}>
                        <div className={classes.noteTitle}>Your <span>Reviews Page</span> is ready to be shared</div>
                        <div className={classes.copyLink}>
                            <div className={classes.link}>
                                {'https://quickrating.page/' + user.customLink}
                            </div>
                            <div className={classes.linkIcon}>
                                <Copy link={'https://quickrating.page/' + user.customLink} />
                            </div>
                        </div>
                        <div className={classes.subNoteTitle}>
                            See what your page looks like
                        </div>
                        <div>
                            <Link
                                className={classes.viewPageLink}
                                target="_blank"
                                href={'https://quickrating.page/' + user.customLink}>
                                View my page
                                <ArrowOutwardIcon />
                            </Link>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div className={classes.cardContainer}>
                        <SubscriptionContent biz={user} />
                    </div>
                </Grid>
            </Grid>
            <div className={classes.reviewsHeading}>
                Reviews
            </div>
            <Grid container spacing={2}>
                {
                    (!reviews || reviews.length <= 0) && (
                        <Grid xs={12} className={classes.reviewCount}>
                            No Reviews Yet
                        </Grid>
                    )
                }
                {
                    !!reviews && reviews?.length > 0 && (
                        <ReviewsContent biz={user} reviews={reviews} isDashboard={true} />
                    )
                }
            </Grid>
        </>
    )
}