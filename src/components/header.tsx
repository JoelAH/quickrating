"use client"

import CONSTANTS from "@/lib/constants";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import Image from 'next/image';
import classes from './header.module.scss';
import { signOut } from "@/lib/firebase/auth";
import { signOutOfServer } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    
    const onSignOut = () => {
        signOut()
            .then(async () => {
                console.log('signingout');
                await signOutOfServer();
                router.replace('/auth/login');
            })
            .catch((e) => console.error(e));
    }

    return (
        <Box sx={{ flexGrow: 1, marginBottom: 1 }}>
            <AppBar position="static" color={'transparent'} >
                <Toolbar>
                    <Image src={'/star.png'} alt={'QuickRating'} width={40} height={40} priority />
                    <Typography className={classes.brand} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {CONSTANTS.appName}
                    </Typography>
                    <Box sx={{ float: 'right', marginLeft: 'auto' }}>
                        <Link href={'/main/dashboard'} passHref>
                            <Button color="info">Dashboard</Button>
                        </Link>
                        <Link href={'/main/update'} passHref>
                            <Button color="info" sx={{ borderRadius: 10 }}>Edit</Button>
                        </Link>
                        <Button color="info" onClick={onSignOut}>Sign Out</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}