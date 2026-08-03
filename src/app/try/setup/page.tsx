"use client";

import { Box, Button, Card, CardActions, CardContent, Container, Grid, TextField, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Sketch } from '@uiw/react-color';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import EmailIcon from '@mui/icons-material/Email';
import RoomIcon from '@mui/icons-material/Room';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/navigation';
import classes from '../../auth/auth.module.scss';
import formClasses from '../../../components/settingsForm.module.scss';
import Link from 'next/link';
import { onCreateTrialPage } from '@/app/actions/createTrialPage';

const socialInputs: { icon: any, label: string, name: string }[] = [
    { icon: <EmailIcon />, label: 'Business Email', name: 'mail' },
    { icon: <RoomIcon />, label: 'Address', name: 'address' },
    { icon: <LocalPhoneIcon />, label: 'Phone Number', name: 'phone' },
    { icon: <WhatsAppIcon />, label: 'Whatsapp', name: 'whatsapp' },
    { icon: <FacebookIcon />, label: 'Facebook URL', name: 'facebook' },
    { icon: <InstagramIcon />, label: 'Instagram URL', name: 'instagram' },
    { icon: <XIcon />, label: 'X URL', name: 'twitter' },
    { icon: <LinkedInIcon />, label: 'LinkedIn URL', name: 'linkedin' },
    { icon: <MusicNoteIcon />, label: 'TikTok URL', name: 'tiktok' }
];

export default function TrialSetup() {
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width:768px)');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [businessName, setBusinessName] = useState<string>('');
    const [usernameExists, setUsernameExists] = useState<boolean>(false);
    const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
    const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
    const [hex, setHex] = useState("#fbbc04");
    const [errors, setErrors] = useState<string[]>([]);

    const isEmailValid = useMemo(() => {
        const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return !email || EMAIL_REGEX.test(email);
    }, [email]);
    
    const isUsernameFormatValid = useMemo(() => {
        const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;
        return !username || USERNAME_REGEX.test(username);
    }, [username]);

    // Check username availability
    useEffect(() => {
        if (!username || !isUsernameFormatValid) {
            setUsernameExists(false);
            return;
        }

        setCheckingUsername(true);
        const checkUsername = setTimeout(async () => {
            try {
                const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
                const data = await response.json();
                setUsernameExists(!data.available);
            } catch (e) {
                console.error('Error checking username:', e);
            } finally {
                setCheckingUsername(false);
            }
        }, 500);

        return () => {
            clearTimeout(checkUsername);
            setCheckingUsername(false);
        };
    }, [username, isUsernameFormatValid]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors([]);

        // Validation
        const validationErrors: string[] = [];
        const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;
        const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!username) {
            validationErrors.push('Username is required');
        } else if (!USERNAME_REGEX.test(username)) {
            validationErrors.push('Username must be 3-30 characters and contain only letters, numbers, hyphens, and underscores');
        } else if (usernameExists) {
            validationErrors.push('This username is already taken');
        }

        if (!businessName) {
            validationErrors.push('Business name is required');
        }

        if (email && !EMAIL_REGEX.test(email)) {
            validationErrors.push('Please enter a valid email address');
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            
            const result = await onCreateTrialPage(null, formData);
            
            if (result.error) {
                setErrors([result.error]);
                setIsLoading(false);
                return;
            }
            
            if (result.success) {
                toast.success('Trial page created successfully!', {
                    position: "top-right"
                });
                
                // Redirect to success page
                router.push(`/try/success?username=${result.username}${result.claimToken ? `&token=${result.claimToken}` : ''}`);
            }
            
        } catch (e) {
            console.error('Error creating trial page:', e);
            setErrors(['Failed to create trial page. Please try again.']);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md" className={classes.pageContain} sx={{ padding: isMobile ? 1 : 2 }}>
            <ToastContainer />
            <Card>
                <form onSubmit={onSubmit}>
                    <CardContent sx={{ padding: isMobile ? 2 : 4 }}>
                        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
                            <Image
                                src={'/star.png'}
                                alt={'QuickRating'}
                                width={100}
                                height={100}
                                priority />
                            <Typography
                                sx={{ fontSize: 24, fontWeight: 'bold', marginTop: 2 }}
                                color="text.secondary">
                                Try QuickRating Free
                            </Typography>
                            <Typography
                                sx={{ fontSize: 16, marginTop: 1 }}
                                color="text.secondary">
                                Create a trial review page in minutes - no signup required!
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            {/* Username */}
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                        1. Choose your page link<sup>*</sup>
                                    </Typography>
                                    <TextField
                                        name="username"
                                        label="quickrating.page/"
                                        variant="outlined"
                                        placeholder="your-business"
                                        inputProps={{ maxLength: 30 }}
                                        fullWidth
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                        error={(!isUsernameFormatValid && username.length > 0) || usernameExists}
                                        helperText={
                                            checkingUsername ? 'Checking availability...' :
                                            (!isUsernameFormatValid && username.length > 0) ? 'Use only letters, numbers, hyphens, and underscores (3-30 characters)' :
                                            usernameExists ? 'This username is already taken' :
                                            username && !usernameExists ? '✓ Available' : ''
                                        }
                                    />
                                </Box>
                            </Grid>

                            {/* Business Name */}
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                        3. Business name<sup>*</sup>
                                    </Typography>
                                    <TextField
                                        name="businessName"
                                        variant="outlined"
                                        placeholder="Your Business Name"
                                        inputProps={{ maxLength: 100 }}
                                        fullWidth
                                        required
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                    />
                                </Box>
                            </Grid>

                             {/* Email (Optional) */}
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                        2. Email address (optional)
                                    </Typography>
                                    <TextField
                                        name="email"
                                        type="email"
                                        variant="outlined"
                                        placeholder="your@email.com"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={!isEmailValid && email.length > 0}
                                        helperText={
                                            !isEmailValid && email.length > 0 ? 'Please enter a valid email address' :
                                            'Provide your email to claim your page later and unlock more features'
                                        }
                                    />
                                </Box>
                            </Grid>

                            {/* Greeting */}
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                        4. Custom greeting (optional)
                                    </Typography>
                                    <TextField
                                        name="greeting"
                                        variant="outlined"
                                        placeholder="Welcome to our reviews page!"
                                        inputProps={{ maxLength: 100 }}
                                        fullWidth
                                    />
                                </Box>
                            </Grid>

                            {/* Theme Color */}
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                        5. Pick your theme color
                                    </Typography>
                                    <input name="themeColor" type="hidden" value={hex} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Sketch
                                                color={hex}
                                                onChange={(color) => setHex(color.hex)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box 
                                                sx={{ 
                                                    width: '100%', 
                                                    height: 100, 
                                                    backgroundColor: hex,
                                                    borderRadius: 2,
                                                    border: '1px solid #ddd'
                                                }} 
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            {/* Contact Information */}
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                        6. Add contact information (optional)
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {socialInputs.map(social => (
                                            <Grid key={social.name} container item xs={12} sx={{ alignItems: 'center' }}>
                                                <Grid item xs={1}>
                                                    {social.icon}
                                                </Grid>
                                                <Grid item xs={11}>
                                                    <TextField
                                                        name={social.name}
                                                        variant="outlined"
                                                        label={social.label}
                                                        inputProps={{ maxLength: 100 }}
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>

                    <CardActions sx={{ padding: isMobile ? 2 : 4, paddingTop: 0 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <LoadingButton
                                    type="submit"
                                    loading={isLoading}
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={checkingUsername || usernameExists || (!isUsernameFormatValid && username.length > 0)}
                                >
                                    <span>Create Trial Page</span>
                                </LoadingButton>
                            </Grid>

                            {errors.length > 0 && (
                                <Grid item xs={12}>
                                    <Box sx={{ color: 'error.main' }}>
                                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                                            {errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </Box>
                                </Grid>
                            )}

                            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Trial pages include 3 reviews max and expire after 14 days.
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                    Already have an account? <Link href="/auth/login">Login</Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActions>
                </form>
            </Card>
        </Container>
    );
}
