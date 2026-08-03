import Header from "@/components/header";
import SettingsForm from "@/components/settingsForm";
import { getUser } from "@/lib/db/user";
import { SettingsMode } from "@/lib/models/client/page-setting";
import { formatUser } from "@/lib/models/server/user";
import { checkAuth } from "@/lib/services/middleware";
import { Container, Grid } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Update() {
    const decoded = await checkAuth();
    const user = await getUser(decoded?.uid || '');
    if (!user) {
        return redirect('/main/setup');
    }

    return (
        <>
            <Header />
            <Container maxWidth="sm" sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <h1>Update your page</h1>
                    </Grid>
                </Grid>
                <SettingsForm mode={SettingsMode.Update} user={formatUser(user)}></SettingsForm>
            </Container>
        </>
    )
}