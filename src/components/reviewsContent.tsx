import type { Review } from '@/lib/models/client/review';
import type { User } from '@/lib/models/client/user';
import { ReviewContainer } from './reviewCard';
import classes from './reviewsContent.module.scss';

export default function ReviewsContent({ biz, reviews, isDashboard }: { biz: User; reviews: Review[]; isDashboard?: boolean }) {
  const unpublished = reviews.filter(review => !review.published);
  const published = reviews.filter(review => review.published);
  return <div className={classes.groups}>
    <section><div className={classes.groupHeading}><h3>Awaiting publication</h3><span>{unpublished.length}</span></div>{unpublished.length ? <ReviewContainer reviews={unpublished} biz={biz} isDashboard={isDashboard} /> : <p className={classes.empty}>All caught up. There are no unpublished reviews.</p>}</section>
    <section><div className={classes.groupHeading}><h3>On your public page</h3><span>{published.length}</span></div>{published.length ? <ReviewContainer reviews={published} biz={biz} isDashboard={isDashboard} /> : <p className={classes.empty}>Published reviews will appear here and on your page.</p>}</section>
  </div>;
}
