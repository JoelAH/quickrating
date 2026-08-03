"use client";

import { Button, CardActions, CardContent, Grid, TextField, Typography } from '@mui/material';
import { FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import GoogleButton from 'react-google-button';
import Link from 'next/link';
import CONSTANTS from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from '@mui/lab/LoadingButton';
import classes from '@/components/auth.module.scss';

type ClaimFormProps = {
    token: string;
    username: string;
    businessName: string;
    trialEmail?: string;
};

const ClaimForm: React.FC<ClaimFormProps> = ({ token, username, businessName, trialEmail }) => {
    const router = useRouter();
    const [email, setEmail] = useState<string>(trialEmail || '');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [errors, setErrors] = useState<string>('');

    const EMAIL_TEST = useMemo(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, []);

    const isEmailValid = useMemo(() => !!email && EMAIL_TEST.test(email), [email, EMAIL_TEST]);
    const isPasswordValid = useMemo(() => !!password && password.length >= CONSTANTS.maxPasswordLength, [password]);

    const onGoogleSignIn = async () => {
        setIsLoading(true);
        setErrors('');
        
        try {
            // Import Firebase auth functions dynamically
            const { signInWithGoogle } = await import('@/lib/firebase/auth');
            const { onClaimTrialPage } = await import('@/app/actions/claimTrialPage');
            
            // Sign in with Google
            const result = await signInWithGoogle();
            const user = result.user;
            
            // Get ID token
            const idToken = await user.getIdToken();
            
            // Create FormData with token and ID token
            const formData = new FormData();
            formData.append('token', token);
            formData.append('idToken', idToken);
            formData.append('email', user.email || '');
            
            // Call server action
            const response = await onClaimTrialPage(null, formData);
            
            if (response.error) {
                setErrors(response.error);
                setIsLoading(false);
                return;
            }
            
            if (response.success) {
                toast.success('Trial page claimed successfully!');
                setTimeout(() => {
                    router.push(response.redirectUrl || '/main/dashboard');
                }, 1000);
            }
        } catch (error: any) {
            console.error('Google sign-in error:', error);
            setErrors(error.message || 'Failed to sign in with Google. Please try again.');
            setIsLoading(false);
        }
    };

    const onClaimSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) return;
        
        setEmail(email);
        setPassword(password);
        setFormSubmitted(true);
        
        if (!EMAIL_TEST.test(email) || !(password.length >= CONSTANTS.maxPasswordLength)) {
            return;
        }
        
        setIsLoading(true);
        setErrors('');
        
        try {
            // Import Firebase auth functions dynamically
            const { signUpUser } = await import('@/lib/firebase/auth');
            const { onClaimTrialPage } = await import('@/app/actions/claimTrialPage');
            
            // Create Firebase user with email/password
            const userCredential = await signUpUser(email, password);
            const user = userCredential.user;
            
            // Get ID token
            const idToken = await user.getIdToken();
            
            // Create FormData with token and ID token
            const claimFormData = new FormData();
            claimFormData.append('token', token);
            claimFormData.append('idToken', idToken);
            claimFormData.append('email', email);
            
            // Call server action
            const response = await onClaimTrialPage(null, claimFormData);
            
            if (response.error) {
                setErrors(response.error);
                setIsLoading(false);
                return;
            }
            
            if (response.success) {
                toast.success('Trial page claimed successfully!');
                setTimeout(() => {
                    router.push(response.redirectUrl || '/main/dashboard');
                }, 1000);
            }
        } catch (error: any) {
            console.error('Claim error:', error);
            
            // Handle Firebase errors
            if (error.code === CONSTANTS.errors.firebase.EMAIL_USED) {
                setErrors('This email is already registered. Please use a different email or sign in.');
            } else {
                setErrors(error.message || 'Failed to claim trial page. Please try again.');
            }
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={onClaimSubmit}>
            <CardContent sx={{ textAlign: 'center', padding: '20px' }}>
                <ToastContainer />
                <Image
                    src={'/star.png'}
                    alt={'QuickRating'}
                    width={100}
                    height={100}
                    priority />

                <Typography
                    sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}
                    color="text.secondary" 
                    gutterBottom>
                    Claim Your Trial Page
                </Typography>
                
                <Typography
                    sx={{ fontSize: 16, marginBottom: '10px', textAlign: 'center' }}
                    color="text.secondary">
                    <strong>{businessName}</strong>
                </Typography>
                
                <Typography
                    sx={{ fontSize: 14, marginBottom: '30px', textAlign: 'center', color: '#666' }}>
                    Username: {username}
                </Typography>

                <Typography
                    sx={{ fontSize: 16, marginBottom: '20px', textAlign: 'center' }}
                    color="text.secondary">
                    Create your account to keep your reviews and unlock all features
                </Typography>

                <TextField
                    name='email'
                    label="Email Address"
                    variant="outlined"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        width: '100%',
                        margin: '10px 0'
                    }} />
                <TextField
                    name='password'
                    label="Password (min 6 characters)"
                    type='password'
                    variant="outlined"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        width: '100%',
                        margin: '10px 0'
                    }} />

            </CardContent>
            <CardActions sx={{ justifyContent: 'center', padding: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LoadingButton
                            loading={isLoading}
                            type='submit'
                            variant="contained"
                            size='large'
                            fullWidth
                        >
                            <span>Claim Page</span>
                        </LoadingButton>
                    </Grid>
                    {
                       ((formSubmitted && (!isPasswordValid || !isEmailValid)) || !!errors) && (
                            <Grid item xs={12}>
                                <ul>
                                {
                                    !isPasswordValid && 
                                    <li className={classes.errorText}>Please enter a password of at least 6 characters</li>
                                }
                                {
                                    !isEmailValid && 
                                    <li className={classes.errorText}>Please enter a valid email</li>
                                }
                                {
                                    !!errors && 
                                    <li className={classes.errorText}>{ errors }</li>
                                }
                                </ul>
                            </Grid>
                       )
                    }
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        -- or --
                    </Grid>
                    <Grid item xs={12}>
                        <GoogleButton
                            style={{ width: '100%' }}
                            onClick={onGoogleSignIn}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
                        By claiming this page you agree to our <Link
                            href={'/legal/terms'}>Terms & Conditions
                        </Link> & <Link
                            href={'/legal/privacy'}>Privacy Policy
                        </Link>.
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
                        Already have an account? <Link href={'/auth/login'}>Login instead</Link>
                    </Grid>
                </Grid>
            </CardActions>
        </form>
    );
};

export default ClaimForm;
