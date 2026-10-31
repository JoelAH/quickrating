"use client";

import { User } from '@/lib/models/client/user';
import classes from './bizpage.module.scss';
import CheckIcon from '@mui/icons-material/Check';
import LoadingButton from "@mui/lab/LoadingButton";
import { formatDate } from '@/lib/util';
import { useRef, useState } from 'react';
import { checkoutSubscription } from '@/app/actions/checkoutSub';
import { cancelSubscription } from '@/app/actions/cancelSub';

export default function SubscriptionContent({ biz }: { biz: User }): JSX.Element {
    let content: any = null;
    const [isCanceling, setIsCancelling] = useState<boolean>(false);
    const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
    const ugradeFormRef = useRef<HTMLFormElement>(null);
    const cancelFormRef = useRef<HTMLFormElement>(null);

    if (!biz.isSubscribed) {
        content = (
            <div className={classes.subContent}>
                <h2>A little more room to grow.</h2>
                <div className={classes.list}>
                    <div className={classes.listing}>
                        <CheckIcon color="success" />
                        Unlimited Reviews
                    </div>
                    <div className={classes.listing}>
                        <CheckIcon color="success" />
                        Publishing controls
                    </div>
                    <div className={classes.listing}>
                        <CheckIcon color="success" />
                        Remove QuickRating branding
                    </div>
                </div>
                <form ref={ugradeFormRef} action={checkoutSubscription}>
                    <LoadingButton
                        loading={isUpgrading}
                        onClick={() => {
                            setIsUpgrading(true);
                            ugradeFormRef?.current?.requestSubmit();
                        }}
                        variant="contained"
                        size='large'
                        sx={{ borderRadius: 8 }}
                    >
                        <span>Upgrade to Standard · $7/month</span>
                    </LoadingButton>
                </form>
            </div>
        )
    } else if (biz.isSubscribed && biz.payment?.cancelled) {
        content = (
            <div className={classes.subContent}>
                <h3 className={classes.red}>Subscription Cancelled</h3>
                <h4 className={classes.red}>Plan ends on {formatDate(biz.payment?.endsAt)}</h4>
            </div>
        )
    } else if (biz.isSubscribed && !biz.payment?.cancelled) {
        content = (
            <div className={classes.subContent}>
                <h3>You are on the Standard Plan</h3>
                <h4>Renews on {formatDate(biz.payment?.renewsAt)}</h4>
                <form ref={cancelFormRef} action={cancelSubscription}>
                    <LoadingButton
                        loading={isCanceling}
                        onClick={() => {
                            setIsCancelling(true);
                            cancelFormRef?.current?.requestSubmit();
                        }}
                        type='button'
                        color='error'
                        variant="text"
                        size='small'
                        sx={{ borderRadius: 8 }}
                    >
                        <span>Cancel</span>
                    </LoadingButton>
                </form>
            </div >
        )
    }

    return content;
}