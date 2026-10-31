'use client';

import { useEffect } from 'react';
import { initializeFirebaseAnalytics } from '@/lib/firebase/analytics';

export default function FirebaseAnalytics() {
  useEffect(() => {
    void initializeFirebaseAnalytics();
  }, []);

  return null;
}
