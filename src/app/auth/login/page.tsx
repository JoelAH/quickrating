import AuthForm from '@/components/authForm';
import { Container } from '@mui/material';
import { Card } from '@mui/material';
import { Metadata } from 'next';
import { AuthMode } from '@/lib/models/auth';
import { getMetaDataObject } from '@/lib/util';
import classes from '../auth.module.scss';
import { checkAuth } from '@/lib/services/middleware';
import { redirect } from 'next/navigation';

export const metadata: Metadata = getMetaDataObject(
    'Log In',
    'Let\'s get those reviews'
);

export default async function Login() {
    const decoded = await checkAuth(true);
    if (decoded?.uid) {
        redirect('/main/dashboard');
    }

    return (
        <Container maxWidth="sm" className={classes.pageContain} sx={{ padding: 0 }}>
            <Card>
                <AuthForm mode={AuthMode.Login} />
            </Card>
        </Container>
    )
}