'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@/lib/firebase/auth';
import { signOutOfServer } from '@/lib/services/auth';
import classes from './header.module.scss';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState('');
  async function onSignOut() {
    setLeaving(true);
    try {
      await signOut();
      await signOutOfServer();
      router.replace('/auth/login');
    } catch {
      setLeaving(false);
      setError('Could not sign out. Please try again.');
    }
  }
  return <header className={classes.header}>
    <div className={classes.inner}>
      <Link href="/" className={classes.brand}><Image src="/star.png" alt="" width={27} height={27} />QuickRating.</Link>
      <nav aria-label="Your workspace">
        <Link href="/main/dashboard" aria-current={pathname === '/main/dashboard' ? 'page' : undefined}>Overview</Link>
        <Link href="/main/update" aria-current={pathname === '/main/update' ? 'page' : undefined}>Edit page</Link>
      </nav>
      <button type="button" onClick={onSignOut} disabled={leaving}>{leaving ? 'Signing out…' : 'Sign out'} <span aria-hidden="true">↗</span></button>
    </div>
    {error && <p role="alert" className={classes.error}>{error}</p>}
  </header>;
}
