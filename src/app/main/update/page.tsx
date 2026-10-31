import Header from "@/components/header";
import SettingsForm from "@/components/settingsForm";
import { getUser } from "@/lib/db/user";
import { SettingsMode } from "@/lib/models/client/page-setting";
import { formatUser } from "@/lib/models/server/user";
import { checkAuth } from "@/lib/services/middleware";
import Link from "next/link";
import classes from "@/components/workspace.module.scss";
import { redirect } from "next/navigation";

export default async function Update() {
    const decoded = await checkAuth();
    const user = await getUser(decoded?.uid || '');
    if (!user) {
        return redirect('/main/setup');
    }

    return <div className={classes.shell}>
        <Header />
        <main className={classes.container}>
            <div className={classes.heading}><div><p className={classes.eyebrow}>YOUR PAGE, YOUR PERSONALITY</p><h1>Make it feel like you.</h1><p>Update your business details, branding, and the ways customers can reach you.</p></div><Link className={classes.textLink} href={`/${user.customLink}`} target="_blank" rel="noopener noreferrer">View your page ↗</Link></div>
            <SettingsForm mode={SettingsMode.Update} user={formatUser(user)} />
        </main>
    </div>;
}
