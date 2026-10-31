'use client';

import type { Review } from '@/lib/models/client/review';
import type { User } from '@/lib/models/client/user';
import type { TrialPageWithReviews } from '@/lib/models/client/trial-page';
import { Button, Rating, Switch } from '@mui/material';
import { useRef, useState } from 'react';
import { formatDate } from '@/lib/util';
import { onPublishReviewSwitch } from '@/app/actions/publishReview';
import { ImageGeneratorModal } from './imageGeneratorModal';
import classes from './reviewCard.module.scss';

export function ReviewContainer({ reviews, biz, isDashboard }: { reviews: Review[]; biz: User | TrialPageWithReviews; isDashboard?: boolean }) {
  return <div className={classes.reviewGrid}>{reviews.map(review => <ReviewCard key={review._id} review={review} biz={biz} isDashboard={isDashboard} />)}</div>;
}

export function ReviewCard({ review, biz, isDashboard }: { review: Review; biz: User | TrialPageWithReviews; isDashboard?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [publishError, setPublishError] = useState('');
  const canPublish = 'isSubscribed' in biz && biz.isSubscribed;
  return <article className={classes.reviewCard}>
    <div className={classes.person}><span className={classes.avatar} aria-hidden="true">{review.reviewer.name.split(' ').filter(Boolean).slice(0, 2).map(name => name.charAt(0)).join('').toUpperCase()}</span><div><h3>{review.reviewer.name}</h3><time>{formatDate(review.completedAt)}</time></div>{isDashboard && <span className={classes.status}>{review.published ? 'Published' : 'Unpublished'}</span>}</div>
    {!!review.rating && review.rating > 0 && <Rating value={review.rating} readOnly size="small" sx={{ color: '#a9872b', marginTop: 2, fontSize: 19 }} />}
    <p className={classes.comment}>“{review.comment}”</p>
    {isDashboard && <div className={classes.controls}>
      <form ref={formRef} action={onPublishReviewSwitch.bind(null, { id: review._id, isPublished: review.published })}><label><Switch size="small" checked={!!review.published} inputProps={{ 'aria-label': `Publish review by ${review.reviewer.name}` }} onChange={() => { if (!canPublish) { setPublishError('Publishing controls are included in Standard.'); return; } formRef.current?.requestSubmit(); }} />Show on page</label></form>
      {publishError && <p role="status" className={classes.notice}>{publishError}</p>}
      <Button size="small" variant="text" onClick={() => setModalOpen(true)}>Create share image ↗</Button>
    </div>}
    {isDashboard && <ImageGeneratorModal open={modalOpen} onClose={() => setModalOpen(false)} reviewId={review._id} />}
  </article>;
}
