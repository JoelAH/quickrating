"use client";

import { Box, Button, Card, CardContent, Container, Typography, useMediaQuery, Alert } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import classes from '../../auth/auth.module.scss';
import Link from 'next/link';
import { Suspense } from 'react';

function TrialSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isMobile = useMediaQuery('(max-width:768px)');
    
    const username = searchParams.get('username');
    const claimToken = searchParams.get('token');
    const hasEmail = !!claimToken;

    // Redirect if missing required params
    if (!username) {
        router.push('/try/setup');
        return null;
    }

    const pageUrl = `quickrating.page/${username}`;
    const fullUrl = `https://${pageUrl}`;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`, {
            position: "top-right"
        });
    };

    return (
        <Container maxWidth="md" className={classes.pageContain} sx={{ padding: isMobile ? 1 : 2 }}>
            <ToastContainer />
            <Card>
                <CardContent sx={{ padding: isMobile ? 3 : 5 }}>
                    <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
                        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', marginBottom: 2 }} />
                        <Typography
                            sx={{ fontSize: 28, fontWeight: 'bold' }}
                            color="text.primary">
                            Trial Page Created Successfully!
                        </Typography>
                        <Typography
                            sx={{ fontSize: 16, marginTop: 1 }}
                            color="text.secondary">
                            Your review page is ready to share with customers
                        </Typography>
                    </Box>

                    {/* Page URL */}
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 'bold' }}>
                            Your Page URL
                        </Typography>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                padding: 2,
                                backgroundColor: '#f5f5f5',
                                borderRadius: 1,
                                border: '1px solid #ddd'
                            }}>
                            <Typography 
                                sx={{ 
                                    flex: 1, 
                                    fontFamily: 'monospace', 
                                    fontSize: isMobile ? 14 : 16,
                                    wordBreak: 'break-all'
                                }}>
                                {pageUrl}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ContentCopyIcon />}
                                onClick={() => copyToClipboard(fullUrl, 'URL')}
                                sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                            >
                                Copy
                            </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                            Share this link with customers to start collecting reviews!
                        </Typography>
                    </Box>

                    {/* Claim Link */}
                    {hasEmail && claimToken && (
                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 'bold' }}>
                                Claim Link
                            </Typography>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    padding: 2,
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 1,
                                    border: '1px solid #ddd'
                                }}>
                                <Typography 
                                    sx={{ 
                                        flex: 1, 
                                        fontFamily: 'monospace', 
                                        fontSize: isMobile ? 12 : 14,
                                        wordBreak: 'break-all'
                                    }}>
                                    {`https://quickrating.page/claim/${claimToken}`}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={() => copyToClipboard(`https://quickrating.page/claim/${claimToken}`, 'Claim link')}
                                    sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                                >
                                    Copy
                                </Button>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                Save this link to claim your page and unlock more features
                            </Typography>
                        </Box>
                    )}

                    {/* Email Notice */}
                    {hasEmail && (
                        <Alert severity="info" icon={<InfoIcon />} sx={{ marginBottom: 3 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Check your email!
                            </Typography>
                            <Typography variant="body2">
                                We&apos;ve sent you a claim link to convert your trial page into a full account with more features.
                            </Typography>
                        </Alert>
                    )}

                    {/* Trial Limitations */}
                    <Alert severity="warning" sx={{ marginBottom: 3 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                            Trial Page Limitations
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li>Maximum of 3 reviews</li>
                            <li>Reviews are automatically published</li>
                            <li>Page expires after 14 days</li>
                            <li>No dashboard access</li>
                        </ul>
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                            {hasEmail 
                                ? 'Claim your page to unlock more reviews, moderation controls, and more!'
                                : 'Upgrade to a full account to get more reviews, moderation controls, and more!'}
                        </Typography>
                    </Alert>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, marginTop: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth={isMobile}
                            component={Link}
                            href={`/${username}`}
                            sx={{ flex: 1 }}
                        >
                            View My Page
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth={isMobile}
                            onClick={() => copyToClipboard(fullUrl, 'URL')}
                            startIcon={<ContentCopyIcon />}
                            sx={{ flex: 1 }}
                        >
                            Copy Link to Share
                        </Button>
                    </Box>

                    {/* Additional Info */}
                    <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            Share your page URL with customers to start collecting reviews!
                        </Typography>
                        {!hasEmail && (
                            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                Want to claim this page later? <Link href="/auth/signup">Create a full account</Link>
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default function TrialSuccess() {
    return (
        <Suspense fallback={
            <Container maxWidth="md" className={classes.pageContain}>
                <Card>
                    <CardContent sx={{ padding: 5, textAlign: 'center' }}>
                        <Typography>Loading...</Typography>
                    </CardContent>
                </Card>
            </Container>
        }>
            <TrialSuccessContent />
        </Suspense>
    );
}
