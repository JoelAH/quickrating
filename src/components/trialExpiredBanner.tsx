"use client"

import { Alert, AlertTitle, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import Link from "next/link";
import classes from './trialExpiredBanner.module.scss';

type TrialExpiredBannerProps = {
    expiresAt: Date;
    claimToken?: string;
};

export default function TrialExpiredBanner({ expiresAt, claimToken }: TrialExpiredBannerProps) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) {
        return null;
    }

    const expirationDate = new Date(expiresAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className={classes.bannerContainer}>
            <Alert 
                severity="warning" 
                className={classes.banner}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setDismissed(true)}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                <AlertTitle className={classes.title}>Trial Page Expired</AlertTitle>
                <div className={classes.content}>
                    <span>This trial page expired on {expirationDate}. Claim it to continue using QuickRating.</span>
                    {claimToken && (
                        <Link href={`/claim/${claimToken}`} passHref>
                            <Button 
                                variant="contained" 
                                color="warning"
                                size="small"
                                className={classes.claimButton}
                            >
                                Claim Page
                            </Button>
                        </Link>
                    )}
                </div>
            </Alert>
        </div>
    );
}
