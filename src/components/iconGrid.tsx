"use client";

import { Avatar, Grid, useMediaQuery } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import RoomIcon from '@mui/icons-material/Room';
import { PageContact, User } from "@/lib/models/client/user";
import { TrialPageWithReviews, TrialPageContact } from "@/lib/models/client/trial-page";
import { getColorContrast, getContactLink } from "@/lib/util";

function getSocialIcon(social: string, biz: User | TrialPageWithReviews) {
    const iconStyle = {
        backgroundColor: `${biz.themeColor}`,
        marginRight: 2,
        width: 48,
        height: 48,
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px) scale(1.1)',
            boxShadow: `0 8px 16px ${biz.themeColor}60`
        }
    };

    const innerIconStyle = {
        backgroundColor: `${biz.themeColor}`,
        color: `${getColorContrast(biz.themeColor)}`
    };

    switch (social) {
        case 'mail':
            return (<Avatar sx={iconStyle}>
                <EmailIcon sx={innerIconStyle} />
            </Avatar>);
        case 'address':
            return (<Avatar sx={iconStyle}>
                <RoomIcon sx={innerIconStyle} />
            </Avatar>);
        case 'phone':
            return (<Avatar sx={iconStyle}>
                <LocalPhoneIcon sx={innerIconStyle} />
            </Avatar>);
        case 'whatsapp':
            return (<Avatar sx={iconStyle}>
                <WhatsAppIcon sx={innerIconStyle} />
            </Avatar>);
        case 'facebook':
            return (<Avatar sx={iconStyle}>
                <FacebookIcon sx={innerIconStyle} />
            </Avatar>);
        case 'instagram':
            return (<Avatar sx={iconStyle}>
                <InstagramIcon sx={innerIconStyle} />
            </Avatar>);
        case 'twitter':
            return (<Avatar sx={iconStyle}>
                <XIcon sx={innerIconStyle} />
            </Avatar>);
        case 'linkedin':
            return (<Avatar sx={iconStyle}>
                <LinkedInIcon sx={innerIconStyle} />
            </Avatar>);
        case 'tiktok':
            return (<Avatar sx={iconStyle}>
                <MusicNoteIcon sx={innerIconStyle} />
            </Avatar>);
    }
}

export default function IconGrid({ biz }: { biz: User | TrialPageWithReviews }) {
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <Grid container item spacing={isMobile ? 2 : 3} xs={12} sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginTop: 3,
            marginBottom: 2
        }}>
            {
                Object.entries(biz.contact || {}).map(([social, value]) => {
                    if (social === 'address' || !value) return null;
                    return (
                        <Grid key={social} item>
                            <a
                                href={social === 'mail' ? ('mailto:' + biz.contact!.mail) : ((social === 'phone' || social === 'whatsapp') ? 'tel:' + (social === 'phone' ? biz.contact!.phone : biz.contact!.whatsapp) : getContactLink(biz.contact, social as keyof (PageContact | TrialPageContact)))}
                                target="_blank"
                                style={{ textDecoration: 'none' }}>
                                {getSocialIcon(social, biz)}
                            </a>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}