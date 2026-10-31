import BusinessPageView from "@/components/businessPageView";
import dbConnect from "@/lib/db/db";
import { getReviewPage, updateHit } from "@/lib/db/user";
import { getTrialPageWithReviews, updateTrialPageHit } from "@/lib/db/trial-page";
import Link from "next/link";
import classes from './userpage.module.scss';
import { Metadata } from "next";
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

    if (!page) return <main className={classes.pageWrapper}><div className={classes.notFound}><h1>This page is still a little quiet.</h1><h3>We could not find this business. Check the link and try again.</h3><Link href="/">Visit QuickRating →</Link></div></main>;

    return <>
        {businessSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema).replace(/</g, '\\u003c') }} />}
        {reviewSchemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />)}
        <BusinessPageView page={page} trial={isTrialPage} />
    </>;
}
