import SettingsForm from "@/components/settingsForm";
import { getUser } from "@/lib/db/user";
import { SettingsMode } from "@/lib/models/client/page-setting";
import { checkAuth } from "@/lib/services/middleware";
import Link from "next/link";
import Image from "next/image";
import classes from "@/components/workspace.module.scss";
import { redirect } from "next/navigation";

export default async function Setup() {
    const decoded = await checkAuth();
    const user = await getUser(decoded?.uid || '');
    if (user) {
        return redirect('/main/dashboard');
    }

    return <div className={classes.shell}>
        <header className={classes.setupHeader}><Link href="/"><Image src="/star.png" alt="" width={27} height={27} />QuickRating.</Link></header>
        <main className={classes.container}>
            <div className={classes.heading}><div><p className={classes.eyebrow}>MAKE YOURSELF AT HOME</p><h1>Good experiences deserve a page.</h1><p>Start with the essentials. You can change the details whenever you like.</p></div></div>
            <SettingsForm mode={SettingsMode.Create} />
        </main>
    </div>;
}
