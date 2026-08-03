"use client";

import { User } from "@/lib/models/client/user";
import { TrialPageWithReviews, isTrialPage } from "@/lib/models/client/trial-page";
import { Button, Grid, Rating, TextField, useMediaQuery } from "@mui/material";
import classes from './submitReview.module.scss';
import EditIcon from '@mui/icons-material/Edit';
import { useCallback, useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormState, useFormStatus } from "react-dom";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { getColorContrast } from "@/lib/util";
import { onInitiateCode } from "@/app/actions/sendCode";
import { onConfirmCode } from "@/app/actions/confirmCode";
import { onSendTrialReviewCode } from "@/app/actions/sendTrialReviewCode";
import { onConfirmTrialReviewCode } from "@/app/actions/confirmTrialReviewCode";

function ConfirmSubmit({ biz }: { biz: User | TrialPageWithReviews }): JSX.Element {
    const { pending } = useFormStatus();

    return (
        <LoadingButton
            disabled={pending}
            loading={pending}
            style={{
                background: `${biz.themeColor}`,
                color: `${getColorContrast(biz.themeColor)}`
            }}
            size="medium"
            type='submit'
            variant="contained"
        >
            <span>Done</span>
        </LoadingButton>
    )
}

function SendCodeSubmit({ biz, isValidPreCode }: { biz: User | TrialPageWithReviews, isValidPreCode: boolean }): JSX.Element {
    const { pending } = useFormStatus();

    return (
        <LoadingButton
            disabled={pending || !isValidPreCode}
            loading={pending}
            style={{
                background: (pending || !isValidPreCode) ? 'lightgrey' : `${biz.themeColor}`,
                color: `${getColorContrast(biz.themeColor)}`
            }}
            size="medium"
            type='submit'
            variant="contained"
        >
            <span>Submit</span>
        </LoadingButton>
    )
}

function SendCodeForm({ biz, onCodeSent }: { biz: User | TrialPageWithReviews, onCodeSent: (id: string, val: boolean) => void }): JSX.Element {
    const [starRating, setStarRating] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [emailedCode, setEmailedCode] = useState<boolean>(false);

    const [isValidPreCode, setIsValidPreCode] = useState<boolean>(false);
    
    // Detect if this is a trial page or regular page
    const isTrial = isTrialPage(biz);
    const sendCodeAction = isTrial ? onSendTrialReviewCode : onInitiateCode;
    const [state, formAction] = useFormState(sendCodeAction, {});

    const isMobile = useMediaQuery('(max-width:768px)');

    useEffect(() => {
        if (
            !!email &&
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) &&
            !!name &&
            !!comment
        ) {
            setIsValidPreCode(true);
        }
    }, [email, name, comment])

    useEffect(() => {
        if (state?.success && state?.id) {
            setEmailedCode(true);
            onCodeSent(state.id as string, true);
        }
    }, [state])

    return (
        <Grid item xs={12} sx={{ margin: isMobile ? '0 15px' : '0 auto' }}>
            <form style={{ marginTop: '40px' }} action={formAction}>
                <input type="hidden" name="id" value={biz._id.toString()} />
                <Grid item xs={12} className={classes.gridrow}>
                    <TextField
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={emailedCode}
                        label="Enter name"
                        variant="outlined"
                        inputProps={{ maxLength: 100 }}
                        fullWidth
                        required />
                </Grid>
                <Grid item xs={12} className={classes.gridrow} sx={{ textAlign: 'center' }}>
                    <input name="rating" type="hidden" value={starRating} />
                    <Rating
                        name="coderating"
                        value={starRating}
                        precision={1}
                        sx={{ fontSize: 40 }}
                        onChange={(event, newValue) => {
                            setStarRating(newValue || 0);
                        }}
                    />
                </Grid>
                <Grid item xs={12} className={classes.gridrow}>
                    <textarea
                        className={classes.commentArea}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        name="comment"
                        disabled={emailedCode}
                        placeholder="Share details of your own experience (Max 1000 characters)"
                        maxLength={1000}
                        style={{ width: '98%' }}
                        required>
                    </textarea>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.emailInstructions}>
                        Please provide your email address for verification.
                        We&apos;ll send a unique code to this email to ensure the authenticity of your review and protect the integrity of our platform.
                    </div>
                </Grid>
                <Grid item xs={12} className={classes.gridrow}>
                    <TextField
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={emailedCode}
                        label="Enter email address"
                        variant="outlined"
                        inputProps={{ maxLength: 100 }}
                        fullWidth
                        required />
                </Grid>
                {
                    !emailedCode && (
                        <Grid item xs={12} className={classes.gridrow} sx={{ textAlign: 'center' }}>
                            <SendCodeSubmit biz={biz} isValidPreCode={isValidPreCode} />
                        </Grid>
                    )
                }
                {
                    state?.error && (
                        <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
                            <span className={classes.error}>{state.error}</span>
                        </Grid>
                    )
                }
            </form>
        </Grid>
    )
}

function ConfirmCode({ biz, reviewId, onReviewDone }: { biz: User | TrialPageWithReviews, reviewId: string, onReviewDone: (val: boolean) => void }): JSX.Element {
    // Detect if this is a trial page or regular page
    const isTrial = isTrialPage(biz);
    const confirmCodeAction = isTrial ? onConfirmTrialReviewCode : onConfirmCode;
    const [state, formAction] = useFormState(confirmCodeAction, {});
    const isMobile = useMediaQuery('(max-width:768px)');

    useEffect(() => {
        if (state?.success) {
            onReviewDone(true);
        }
    }, [state])

    return (
        <Grid item xs={12} sx={{ margin: isMobile ? '0 15px' : '0 auto' }}>
            <form action={formAction}>
                <input type="hidden" name="pageId" value={biz._id.toString()} />
                <input type="hidden" name="reviewId" value={reviewId} />
                <Grid item xs={12} className={classes.gridrow}>
                    Enter the code you received in your email & click &lsquo;Done&rsquo; to complete this submission.
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="confirmCode"
                        label="Enter Code"
                        variant="outlined"
                        inputProps={{ maxLength: 10 }}
                        fullWidth
                        required />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }} className={classes.gridrow}>
                    <ConfirmSubmit biz={biz} />
                </Grid>
                {
                    state?.error && (
                        <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
                            <span className={classes.error}>{state.error}</span>
                        </Grid>
                    )
                }
            </form>
        </Grid>
    )
}

export default function SubmitReview({ biz }: { biz: (User | TrialPageWithReviews) & { maxedReviews?: boolean } }) {
    const [canWriteReview, setCanWriteReview] = useState<boolean>(false);
    const [isDoneReview, setIsDoneReview] = useState<boolean>(false);
    const [codeSent, setCodeSent] = useState<boolean>(false);
    const [reviewId, setReviewId] = useState<string>('');

    const onCodeSent = useCallback((id: string, val: boolean) => {
        setCodeSent(val);
        setReviewId(id);
    }, [])

    const onReviewDone = useCallback((val: boolean) => {
        setIsDoneReview(val);
    }, [])

    useEffect(() => {
        if (isDoneReview) {
            const isTrial = isTrialPage(biz);
            const message = isTrial 
                ? `Yay! Review Submitted! Your review is now visible on this page.`
                : `Yay! Review Submitted! ${biz.businessName} will be notified of your review. It may take a while for it to be visible on this page.`;
            
            toast.success(message, {
                position: "top-right"
            });
        }
    }, [isDoneReview, biz])

    return (
        <>
            <ToastContainer />
            {
                !biz.maxedReviews && (
                    <Grid item xs={12} className={classes.textCenter} sx={{ marginTop: biz.reviews?.length ? 5 : 0 }}>
                        <Button
                            onClick={() => setCanWriteReview(true)}
                            className={classes.writeReviewBtn}
                            sx={{ 
                                backgroundColor: `${biz.themeColor}`,
                                color: 'white',
                                borderColor: `${biz.themeColor}`,
                                '&:hover': {
                                    backgroundColor: `${biz.themeColor}`,
                                    opacity: 0.9,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 8px 20px ${biz.themeColor}40`
                                }
                            }}
                            variant="contained"
                            size="large"
                            endIcon={<EditIcon />}>
                            Write A Review
                        </Button>
                    </Grid>
                )
            }
            {
                (canWriteReview && !isDoneReview) && (
                    <Grid item container xs={12} md={4} sx={{ margin: '0 auto' }}>
                        <SendCodeForm biz={biz} onCodeSent={onCodeSent} />
                        {
                            codeSent && (
                                <ConfirmCode biz={biz} reviewId={reviewId} onReviewDone={onReviewDone} />
                            )
                        }
                    </Grid>
                )
            }
        </>
    )
}