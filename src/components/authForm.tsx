"use client";

import { AuthMode } from '@/lib/models/auth';
import { Button, CardActions, CardContent, Grid, TextField, Typography } from '@mui/material';
import { FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import GoogleButton from 'react-google-button';
import Link from 'next/link';
import CONSTANTS from '@/lib/constants';
import { signInToServer } from '@/lib/services/auth';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { loginUser, sendVerificationMail, signInWithGoogle, signOut, signUpUser } from '@/lib/firebase/auth';
import LoadingButton from '@mui/lab/LoadingButton';
import classes from './auth.module.scss';

type AuthProps = {
    mode: AuthMode
}

const AuthForm: React.FC<AuthProps> = ({ mode }) => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [signUpPressed, setSignUpPressed] = useState<boolean>(false);
    const [errors, setErrors] = useState<string>('');

    const PASSWORD_TEST = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isEmailValid = useMemo(() => !!email && PASSWORD_TEST.test(email), [email]);
    const isPasswordValid = useMemo(() => !!password && password.length >= CONSTANTS.maxPasswordLength, [password, PASSWORD_TEST]);

    const onGoogleSignIn = () => {
        signInWithGoogle()
            .then(async (userCred) => {
                if (!userCred?.user) {
                    return;
                }
                setIsLoading(false);
                setErrors('');
                await signInToServer(userCred.user);
                router.replace("/main/dashboard");
            })
            .catch((e) => {
                setIsLoading(false);
                if (e.code === CONSTANTS.errors.firebase.EMAIL_USED) {
                    setErrors('You have already signed up! Please log into your account.');
                } else {
                    setErrors(CONSTANTS.errors.defaultMessage);
                }
            });
    }

    const onAuthAction = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) return;
        setEmail(email);
        setPassword(password);
        if (!PASSWORD_TEST.test(email) || !(password.length >= CONSTANTS.maxPasswordLength)) {
            setSignUpPressed(true);
            return;
        }
        
        setIsLoading(true);
        if (mode === AuthMode.Signup) {
            signUpUser(email, password)
                .then(async (res) => {
                    setIsLoading(false);
                    setErrors('');
                    await sendVerificationMail(res.user);
                    await signOut();
                    toast.success("Please go to your email to verify your email adress", {
                        position: "top-right"
                    });
                })
                .catch(e => {
                    setIsLoading(false);
                    if (e.code === CONSTANTS.errors.firebase.EMAIL_USED) {
                        setErrors('You have already signed up! Please log into your account.');
                    } else {
                        setErrors(CONSTANTS.errors.defaultMessage);
                    }
                })
        } else {
            loginUser(email, password)
                .then(async (res) => {
                    setIsLoading(false);
                    setErrors('');
                    if (!res.user.emailVerified) {
                        setErrors("Email not verified. Please verify your email address.");
                        await signOut();
                    } else {
                        await signInToServer(res.user);
                        router.replace('/main/dashboard');
                    }
                })
                .catch(e => {
                    setIsLoading(false);
                    console.log(JSON.stringify(e))
                    if (e.code === CONSTANTS.errors.firebase.EMAIL_USED) {
                        setErrors('You have already signed up! Please log into your account.');
                    } else if(e.code === 'auth/invalid-credential') {
                        setErrors('Incorrect email/password.');
                    }
                    else {
                        setErrors(CONSTANTS.errors.defaultMessage);
                    }
                })
        }

    }

    return (
        <form onSubmit={onAuthAction}>
            <CardContent sx={{ textAlign: 'center', padding: '20px' }}>
                <ToastContainer />
                <Image
                    src={'/star.png'}
                    alt={'QuickRating'}
                    width={100}
                    height={100}
                    priority />

                <Typography
                    sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}
                    color="text.secondary" gutterBottom>
                    {mode === AuthMode.Signup ? 'Signup for free' : `Login to ${CONSTANTS.appName}`}
                </Typography>
                <Typography
                    sx={{ fontSize: 18, marginBottom: '40px', textAlign: 'center' }}
                    color="text.secondary" gutterBottom>
                    {mode === AuthMode.Signup ? 'You are 5 minutes away from having your own reviews page' : 'Let\'s get those reviews!'}
                </Typography>
                <TextField
                    name='email'
                    label="Email Address"
                    variant="outlined"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        width: '100%',
                        margin: '10px 0'
                    }} />
                <TextField
                    name='password'
                    label="Password"
                    type='password'
                    variant="outlined"
                    required
                    onChange={(e) => setEmail(e.target.value)}
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
                            <span>{mode === AuthMode.Signup ? 'Sign Up' : 'Log In'}</span>
                        </LoadingButton>
                    </Grid>
                    {
                       ((signUpPressed && (!isPasswordValid || !isEmailValid)) || !!errors) && (
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
                    {
                        mode === AuthMode.Signup && (
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                By signing up you agree to our <Link
                                    href={'/legal/terms'}>Terms & Conditions
                                </Link> & <Link
                                    href={'/legal/privacy'}>Privacy Policy
                                </Link>.
                            </Grid>
                        )
                    }
                    <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
                        {
                            mode === AuthMode.Signup ?
                                <>
                                    Already have an account? <Link href={'/auth/login'}>Login to your account</Link>
                                </> :
                                <>
                                    Don&apos;t have an account? <Link href={'/auth/signup'}>Sign up</Link>
                                </>
                        }
                    </Grid>
                    {
                        mode === AuthMode.Login && (
                            <Grid item xs={12} sx={{ marginTop: '20px' }}>
                                <Button
                                    onClick={() => router.push("/auth/reset")}
                                    variant="text"
                                    size='large'
                                    fullWidth>
                                    Forgot Password?
                                </Button>
                            </Grid>
                        )
                    }
                </Grid>
            </CardActions>
        </form>
    )
}


export default AuthForm;