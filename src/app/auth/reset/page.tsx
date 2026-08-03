"use client"

import { CardActions, CardContent, Container, Grid, TextField, Typography } from '@mui/material';
import { Card } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FormEvent, useState } from 'react';
import { resetPassword } from '@/lib/firebase/auth';
import Link from 'next/link';
import LoadingButton from '@mui/lab/LoadingButton';

export default function Reset() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function onReset(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        if (!email) return;

        setIsLoading(true);
        resetPassword(email)
            .then(async () => {
                setIsLoading(false);
                toast.success("Reset email sent", {
                    position: "top-right"
                });
            })
            .catch(e => {
                setIsLoading(false);
            })
    }

    return (
        <Container maxWidth="sm" sx={{ marginTop: '100px' }}>
            <ToastContainer />
            <Card>
                <form onSubmit={onReset}>
                    <CardContent sx={{ textAlign: 'center', padding: '20px' }}>
                        <Typography
                            sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}
                            color="text.secondary" gutterBottom>
                            Reset Password
                        </Typography>
                        <TextField
                            name='email'
                            label="Email Address"
                            required
                            variant="outlined"
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
                                    <span>Reset Password</span>
                                </LoadingButton>
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
                                Return to <Link href={'/auth/login'}>Login</Link>
                            </Grid>
                        </Grid>
                    </CardActions>
                </form>
            </Card>
        </Container>
    )
}