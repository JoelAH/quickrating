import { Container, Card } from '@mui/material';
import { Metadata } from 'next';
import { getMetaDataObject } from '@/lib/util';
import classes from '../../auth/auth.module.scss';
import { getTrialPageByToken } from '@/lib/db/trial-page';
import dbConnect from '@/lib/db/db';
import ClaimForm from '@/app/claim/[token]/ClaimForm';

export const metadata: Metadata = getMetaDataObject(
    'Claim Your Trial Page',
    'Convert your trial page to a full account'
);

type ClaimPageProps = {
    params: {
        token: string;
    };
};

export default async function ClaimPage({ params }: ClaimPageProps) {
    await dbConnect();
    
    const { token } = params;
    
    // Validate claim token on page load
    const trialPage = await getTrialPageByToken(token);
    
    // Show error if token invalid or expired
    if (!trialPage) {
        return (
            <Container maxWidth="sm" className={classes.pageContain} sx={{ padding: 0 }}>
                <Card sx={{ padding: '40px', textAlign: 'center' }}>
                    <h1>Invalid Claim Link</h1>
                    <p>This claim link is invalid or has expired.</p>
                    <p>If you created a trial page, please check your email for the correct link.</p>
                </Card>
            </Container>
        );
    }
    
    // Check if already claimed
    if (trialPage.claimed) {
        return (
            <Container maxWidth="sm" className={classes.pageContain} sx={{ padding: 0 }}>
                <Card sx={{ padding: '40px', textAlign: 'center' }}>
                    <h1>Already Claimed</h1>
                    <p>This trial page has already been claimed.</p>
                    <p>If this is your page, please log in to access your dashboard.</p>
                </Card>
            </Container>
        );
    }
    
    // Check if token expired
    const now = new Date();
    if (trialPage.claimTokenExpiry && new Date(trialPage.claimTokenExpiry) < now) {
        return (
            <Container maxWidth="sm" className={classes.pageContain} sx={{ padding: 0 }}>
                <Card sx={{ padding: '40px', textAlign: 'center' }}>
                    <h1>Claim Link Expired</h1>
                    <p>This claim link has expired.</p>
                    <p>Trial pages can be claimed within 14 days of creation.</p>
                </Card>
            </Container>
        );
    }
    
    // Display trial page info and claim form
    return (
        <Container maxWidth="sm" className={classes.pageContain} sx={{ padding: 0 }}>
            <Card>
                <ClaimForm 
                    token={token}
                    username={trialPage.username}
                    businessName={trialPage.businessName}
                    trialEmail={trialPage.email}
                />
            </Card>
        </Container>
    );
}
