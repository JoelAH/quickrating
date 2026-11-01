import type { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { User } from '@/lib/models/client/user';
import type { TrialPageWithReviews } from '@/lib/models/client/trial-page';
import BizPage from './bizpage';
import SubmitReview from './submitReview';
import { ReviewContainer } from './reviewCard';
import { getPageBackgroundStyle } from '@/lib/pageBackgrounds';
import classes from '@/app/[username]/userpage.module.scss';

export default function BusinessPageView({ page, trial = false }: { page: (User | TrialPageWithReviews) & { maxedReviews?: boolean }; trial?: boolean }) {
  const reviews = page.reviews || [];
  const rated = reviews.filter(review => review.rating && review.rating >= 1 && review.rating <= 5);
  const average = rated.length ? (rated.reduce((sum, review) => sum + review.rating!, 0) / rated.length).toFixed(1) : null;
  const branded = trial || !('isSubscribed' in page && page.isSubscribed);
  return <main className={classes.pageWrapper} style={{ ...getPageBackgroundStyle('pageBackground' in page ? page.pageBackground : undefined), '--business-color': page.themeColor || '#f6c345' } as CSSProperties}>
    <div className={classes.contentWrapper}>
      <div className={classes.topLine}><span>IN THEIR OWN WORDS</span><span>{reviews.length} customer review{reviews.length === 1 ? '' : 's'}</span></div>
      <BizPage biz={page} />
      <section className={classes.reviewsSection} aria-labelledby="customer-reviews-title">
        <div className={classes.reviewHeading}><div><p>THE EXPERIENCES BEHIND THE STARS</p><h2 id="customer-reviews-title">A word from our customers.</h2></div>{average && <div className={classes.rating}><strong>{average}</strong><span aria-label={`${average} out of 5 stars`}>★<small> / 5</small></span><small>{rated.length} rating{rated.length === 1 ? '' : 's'}</small></div>}</div>
        <SubmitReview biz={page} />
        {reviews.length ? <ReviewContainer reviews={reviews} biz={page} /> : <div className={classes.emptyState}><span aria-hidden="true">✦</span><h3>The first story could be yours.</h3><p>Have an experience with {page.businessName}? Share a few words to help the next customer.</p></div>}
      </section>
      {branded && <footer className={classes.powered}>A home for kind words.<Link href="/"><Image src="/star.png" alt="" width={17} height={17} />Made with QuickRating</Link></footer>}
    </div>
  </main>;
}
