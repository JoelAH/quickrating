import { User } from "@/lib/models/client/user";
import { TrialPageWithReviews } from "@/lib/models/client/trial-page";
import { Avatar, Grid } from "@mui/material";
import classes from './bizpage.module.scss';
import RoomIcon from '@mui/icons-material/Room';
import IconGrid from "./iconGrid";

interface BizPageProps {
    biz: User | TrialPageWithReviews
}

export default function BizPage({ biz }: BizPageProps) {

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div className={classes.bizLogo} style={{ 
                        ['--theme-color' as any]: biz.themeColor || '#fbbc04' 
                    }}>
                        <Avatar
                            sx={{ border: `2px solid ${biz.themeColor || '#fbbc04'}`, width: '160px', height: '160px', margin: '0 auto' }}
                            alt={biz.businessName}
                            src={biz.imageUrl} />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.bizTitle} style={{ color: `${biz.themeColor}` }}>
                        {biz.businessName}
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.bizGreeting}>
                        {biz.greeting}
                    </div>
                </Grid>
                {
                    !!biz.contact && (
                        <>
                            {
                                !!biz.contact.address && (
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <RoomIcon sx={{ color: `${biz.themeColor}` }} />
                                        {biz.contact.address}
                                    </Grid>
                                )
                            }
                            <IconGrid biz={biz} />
                        </>
                    )
                }
            </Grid>
        </>
    )
}