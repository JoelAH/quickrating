import Header from './header';
import Copy from './copy';
import Link from 'next/link';
import SubscriptionContent from './subscriptioncontent';
import ReviewsContent from './reviewsContent';
import CONSTANTS from '@/lib/constants';
import type { User } from '@/lib/models/client/user';
import type { Review } from '@/lib/models/client/review';
import classes from './workspace.module.scss';

export default function DashboardView({ user, reviews }: { user: User; reviews: Review[] }) {
  const published = reviews.filter(review => review.published).length;
  const rated = reviews.filter(review => review.rating && review.rating >= 1 && review.rating <= 5);
  const average = rated.length ? (rated.reduce((sum, review) => sum + review.rating!, 0) / rated.length).toFixed(1) : '—';
  const pageUrl = `https://quickrating.page/${user.customLink}`;
  return <div className={classes.shell}>
    <Header />
    <main className={classes.container}>
      <div className={classes.heading}><div><p className={classes.eyebrow}>YOUR REVIEW WORKSPACE</p><h1>A little word of mouth, {user.businessName}.</h1><p>Your customer feedback, ready to collect, manage, and share.</p></div><Link className={classes.textLink} href={`/${user.customLink}`} target="_blank" rel="noopener noreferrer">View your page ↗</Link></div>
      <div className={classes.stats}>
        <div className={classes.stat}><span>Total reviews</span><strong>{reviews.length}</strong><small>{user.isSubscribed ? 'Unlimited on Standard' : `${Math.max(0, CONSTANTS.freeReviewLimit - reviews.length)} of ${CONSTANTS.freeReviewLimit} free reviews left`}</small></div>
        <div className={classes.stat}><span>Published</span><strong>{published}</strong><small>{reviews.length - published} unpublished</small></div>
        <div className={classes.stat}><span>Average rating</span><strong>{average}<small>{rated.length ? ' / 5' : ''}</small></strong><small>{rated.length ? `From ${rated.length} star rating${rated.length === 1 ? '' : 's'}` : 'Your first rating awaits'}</small></div>
      </div>
      <div className={classes.panels}>
        <section className={classes.panel}><p className={classes.eyebrow}>A LINK WORTH SHARING</p><h2>Let your customers do the talking.</h2><p>Send your page after a purchase or finished project. Add it to your bio so new customers can find the feedback.</p><div className={classes.shareLink}><code>{pageUrl}</code><Copy link={pageUrl} /></div><Link href="/main/update" className={classes.textLink}>Make your page your own →</Link></section>
        <section className={classes.panel}><span className={classes.badge}>{user.isSubscribed ? 'STANDARD PLAN' : 'BASIC PLAN'}</span><SubscriptionContent biz={user} /></section>
      </div>
      <section aria-labelledby="reviews-heading"><div className={classes.reviewHeading}><h2 id="reviews-heading">Your customer reviews</h2><span>{reviews.length} total</span></div>
        {reviews.length ? <ReviewsContent biz={user} reviews={reviews} isDashboard /> : <div className={classes.empty}><span aria-hidden="true">✦</span><h3>Your first kind words start here.</h3><p>Copy your page link above and send it to a customer. Their completed review will appear here.</p></div>}
      </section>
    </main>
  </div>;
}
