import SettingsForm from "@/components/settingsForm";
import { getUser } from "@/lib/db/user";
import { SettingsMode } from "@/lib/models/client/page-setting";
import { checkAuth } from "@/lib/services/middleware";
import { Container, Grid } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Setup() {
    const decoded = await checkAuth();
    const user = await getUser(decoded?.uid || '');
    if (user) {
        return redirect('/main/dashboard');
    }

    return (
       <Container 
            maxWidth="md" 
            sx={{ 
                padding: { xs: 2, sm: 3, md: 4 },
                marginTop: { xs: 2, sm: 3, md: 4 },
                marginBottom: { xs: 2, sm: 3, md: 4 },
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: 'center', marginBottom: { xs: 2, md: 3 } }}>
                    <h1 style={{ 
                        fontSize: '36px', 
                        fontWeight: 'bold',
                        margin: 0,
                        color: '#222428'
                    }} className="setupPageTitle">Set up your page</h1>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center', marginBottom: { xs: 3, md: 4 } }}>
                    <p style={{ 
                        fontSize: '20px', 
                        fontWeight: 'normal',
                        lineHeight: '1.5',
                        color: '#555',
                        margin: 0
                    }} className="setupPageSubtitle">Let&apos;s get you started by providing some information about your business. This helps with customizing your page to fit your brand!</p>
                </Grid>
            </Grid>
            <SettingsForm mode={ SettingsMode.Create }></SettingsForm>
       </Container>
    )
}