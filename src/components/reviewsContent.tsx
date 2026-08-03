"use client";

import { Review } from "@/lib/models/client/review";
import { User } from "@/lib/models/client/user";
import { Grid, useMediaQuery } from "@mui/material";
import classes from './reviewsContent.module.scss';
import { ReviewContainer } from "./reviewCard";

export default function ReviewsContent({ biz, reviews, isDashboard }: { biz: User, reviews: Review[], isDashboard?: boolean }): JSX.Element {
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <>
            <Grid item xs={12} className={classes.publishedTitle} sx={{ margin: isMobile ? '0 5px': '0 30px' }}>
                <h4>Unpublished Reviews</h4> <hr />
            </Grid>
            <Grid item container>
                <ReviewContainer isDashboard={isDashboard} reviews={reviews.filter(r => !r.published)} biz={biz} />
            </Grid>
            <Grid item xs={12} className={classes.publishedTitle} sx={{ margin: isMobile ? '0 5px': '0 30px' }}>
                <h4>Published Reviews</h4> <hr />
            </Grid>
            <Grid item container>
                <ReviewContainer isDashboard={isDashboard} reviews={reviews.filter(r => r.published)} biz={biz} />
            </Grid>
        </>

    )
}