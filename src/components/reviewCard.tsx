"use client";

import { Review } from '@/lib/models/client/review';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import classes from './reviewCard.module.scss';
import { User } from '@/lib/models/client/user';
import { TrialPageWithReviews } from '@/lib/models/client/trial-page';
import { Button, Grid, Rating, Switch, Typography, useMediaQuery } from '@mui/material';
import { formatDate } from '@/lib/util';
import { useRef, useState } from 'react';
import { onPublishReviewSwitch } from '@/app/actions/publishReview';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { ImageGeneratorModal } from './imageGeneratorModal';

export function ReviewContainer({ reviews, biz, isDashboard }: { reviews: Review[], biz: User | TrialPageWithReviews, isDashboard?: boolean }): JSX.Element {
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <Grid item container spacing={2} sx={{ 
            margin: isMobile ? '0 5px' : '0 auto',
            maxWidth: '1200px',
            justifyContent: reviews.length === 1 ? 'center' : 'flex-start'
        }}>
            {
                reviews.map((review, index) => {
                    return (
                        <Grid 
                            key={review._id} 
                            item 
                            xs={12} 
                            sm={6} 
                            md={reviews.length === 1 ? 6 : 4}
                            sx={{
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            <ReviewCard review={review} biz={biz} isDashboard={isDashboard} />
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}

export function ReviewCard({ review, biz, isDashboard }: { review: Review, biz: User | TrialPageWithReviews, isDashboard?: boolean }): JSX.Element {
    const formRef = useRef<HTMLFormElement>(null);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Card className={classes.reviewCard}>
            <CardContent className={classes.cardContainer}>
                <div className={classes.accent} style={{ background: `${!!biz?.themeColor ? biz.themeColor : '#bdbdbd'}` }}></div>
                <div style={{ padding: '15px' }}>
                    <Typography className={classes.name}>{review.reviewer.name}</Typography>
                    <Typography className={classes.time}>{formatDate(review.completedAt)}</Typography>
                    {
                        (review.rating && review.rating > 0) && (
                            <div style={{ paddingTop: '10px' }}>
                                <Rating
                                    value={review.rating}
                                    precision={1}
                                    sx={{ fontSize: 30 }}
                                    readOnly
                                />
                            </div>
                        )
                    }
                    <div className={classes.comment}>
                        &ldquo;{review.comment}&rdquo;
                    </div>
                    {
                        isDashboard && (
                            <div style={{ marginTop: 20 }}>
                                <form ref={formRef} action={onPublishReviewSwitch.bind(null, { id: review._id, isPublished: review.published })}>
                                    {review.published ? 'Unpublish' : 'Publish'}
                                    <Switch 
                                        checked={review.published} 
                                        onChange={() => {
                                            if (!('isSubscribed' in biz) || !biz.isSubscribed) {
                                                alert('Please purchase a subscription to update publish status');
                                                return;
                                            }
                                            formRef.current?.requestSubmit()
                                        }} />
                                </form>
                                <Button
                                    variant="outlined"
                                    startIcon={<CameraAltIcon />}
                                    onClick={() => setModalOpen(true)}
                                    sx={{ marginTop: 2 }}
                                >
                                    Create Image
                                </Button>
                            </div>
                        )
                    }
                </div>
            </CardContent>
            <ImageGeneratorModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                reviewId={review._id}
            />
        </Card>
    )
}