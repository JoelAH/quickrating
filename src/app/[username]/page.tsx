import dbConnect from "@/lib/db/db";
import { getReviewPage, updateHit } from "@/lib/db/user";
import { getTrialPageWithReviews, updateTrialPageHit } from "@/lib/db/trial-page";
import { Grid } from "@mui/material";
import Image from 'next/image';
import Link from "next/link";
import classes from './userpage.module.scss';
import BizPage from "@/components/bizpage";
import SubmitReview from "@/components/submitReview";
import { ReviewContainer } from "@/components/reviewCard";
import { Metadata } from "next";
import { User } from "@/lib/models/client/user";
import { TrialPageWithReviews } from "@/lib/models/client/trial-page";
import { generateLocalBusinessSchema, generateReviewSchema } from "@/lib/structuredData";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    await dbConnect();

    // Check User collection first
    let userPage = await getReviewPage(params.username);
    let trialPage: TrialPageWithReviews | null = null;

    // If not found in User collection, check TrialPage collection
    if (!userPage) {
        trialPage = await getTrialPageWithReviews(params.username);
    }

    const page = userPage || trialPage;

    if (page) {
        const reviewCount = page.reviews?.length || 0;
        const ratedReviews = (page.reviews || []).filter(r => typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5);
        const avgRating = ratedReviews.length > 0
            ? (ratedReviews.reduce((sum, r) => sum + r.rating!, 0) / ratedReviews.length).toFixed(1)
            : null;

        const description = page.greeting || `Read ${reviewCount} customer review${reviewCount !== 1 ? 's' : ''} for ${page.businessName}. ${avgRating ? `Average rating: ${avgRating}/5 stars.` : ''} Share your experience!`;

        return {
            title: `${page.businessName} Reviews ${avgRating ? `- ${avgRating}★` : ''} | Customer Testimonials`,
            description,
            keywords: `${page.businessName} reviews, customer reviews, testimonials, ratings, ${page.businessName} feedback`,
            openGraph: {
                title: `${page.businessName} Reviews ${avgRating ? `- ${avgRating}★` : ''}`,
                description,
                url: `https://quickrating.page/${params.username}`,
                siteName: 'QuickRating',
                type: 'website',
                images: [{
                    url: page.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/pintratings.appspot.com/o/images%2Fstar.png?alt=media&token=0e0d967b-b657-47ee-be2c-440670d0c60e',
                    width: 1200,
                    height: 630,
                    alt: `${page.businessName} Logo`
                }]
            },
            twitter: {
                card: 'summary_large_image',
                title: `${page.businessName} Reviews ${avgRating ? `- ${avgRating}★` : ''}`,
                description,
                creator: '@QuickRating',
                images: [page.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/pintratings.appspot.com/o/images%2Fstar.png?alt=media&token=0e0d967b-b657-47ee-be2c-440670d0c60e']
            },
            alternates: {
                canonical: `https://quickrating.page/${params.username}`
            }
        }
    } else {
        return {
            title: 'Page Not Found | QuickRating',
            description: 'This review page could not be found. Create your own review page with QuickRating.'
        }
    }

}

export default async function RatingPage({ params }: { params: { username: string } }) {
    await dbConnect();

    // Check User collection first
    let userPage = await getReviewPage(params.username);
    let trialPage: TrialPageWithReviews | null = null;
    let isTrialPage = false;

    // If not found in User collection, check TrialPage collection
    if (!userPage) {
        trialPage = await getTrialPageWithReviews(params.username);
        isTrialPage = true;
    }

    // Update hit counter for whichever type was found
    if (userPage) {
        updateHit(params.username);
    } else if (trialPage) {
        updateTrialPageHit(params.username);
    }

    // Use whichever page was found
    const page = userPage || trialPage;

    // Check if trial page is expired
    const isExpired = isTrialPage && trialPage && trialPage.expired;

    // Generate structured data
    const businessSchema = page ? generateLocalBusinessSchema(page) : null;
    const reviewSchemas = page?.reviews?.map(review =>
        generateReviewSchema(review, page.businessName)
    ) || [];

    return (
        <div className={classes.pageWrapper}>
            {
                !page ?
                    (
                        <Grid container spacing={2} className={classes.notFound}>
                            <Grid item xs={12}>
                                <Image
                                    src={'/sad.png'}
                                    alt={'rating'}
                                    width={80}
                                    height={80}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <h1>Sorry, we could not find that page</h1>
                                <h3>Check that you have the right link</h3>
                            </Grid>
                            <Grid item xs={12}>
                                <h3>Anyway, this page would have been powered by <Link href={'/'}>QuickRating</Link>. Check it out.</h3>
                            </Grid>
                        </Grid>
                    ) :
                    (
                        <>
                            {businessSchema && (
                                <script
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}>
                                </script>
                            )}
                            {reviewSchemas.map((schema, index) => (
                                <script
                                    key={index}
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}>
                                </script>
                            ))}
                            <div className={classes.contentWrapper}>
                                <BizPage biz={page} />
                                <Grid container spacing={2} sx={{ marginTop: 4 }}>
                                    {
                                        (!page?.reviews || page.reviews.length <= 0) && (
                                            <Grid item xs={12} className={classes.beFirst}>
                                                <div className={classes.emptyState}>
                                                    <div className={classes.emptyIcon}>⭐</div>
                                                    <div className={classes.emptyTitle}>No reviews yet</div>
                                                    <div className={classes.emptyText}>Be the first to share your experience with {page.businessName}</div>
                                                </div>
                                            </Grid>
                                        )
                                    }
                                    <SubmitReview biz={page} />
                                    {
                                        (page.reviews && page.reviews.length > 0) && (
                                            <Grid item xs={12} className={classes.reviewCount} sx={{ marginLeft: 2 }}>
                                                {page.reviews.length} review{page.reviews.length === 1 ? '' : 's'}
                                            </Grid>
                                        )
                                    }
                                    {
                                        (page.reviews && page.reviews.length > 0) && (
                                            <ReviewContainer reviews={page.reviews} biz={page} />
                                        )
                                    }
                                    {
                                        // Show "Powered by QuickRating" for trial pages or non-subscribed users
                                        (isTrialPage || (!isTrialPage && !(page as User & { isSubscribed?: boolean }).isSubscribed)) && (
                                            <Grid item xs={12} sx={{
                                                margin: '60px auto 40px',
                                                textAlign: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <div style={{
                                                    fontSize: 18,
                                                    textAlign: 'center',
                                                    color: '#777',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <span style={{ fontWeight: 600 }}>Powered By</span>
                                                    <Link href={'/'} style={{
                                                        color: '#FBBC04',
                                                        fontWeight: 700,
                                                        textDecoration: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        QuickRating
                                                        <Image src={'/star.png'} alt="QuickRating Logo" width={22} height={22} />
                                                    </Link>
                                                </div>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </div>
                        </>
                    )
            }
        </div>
    )
}
