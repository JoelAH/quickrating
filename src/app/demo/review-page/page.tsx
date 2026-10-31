import type { Metadata } from 'next';
import Link from 'next/link';
import ExampleReviewPage from '@/components/exampleReviewPage';

export const metadata: Metadata = {
  title: 'Example Customer Review Page',
  description: 'Explore an illustrative QuickRating page with sample testimonials, then create your own branded customer review page.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/demo/review-page' },
};
export default function ExamplePage() {
  return <main style={{ background: '#fbfaf6', minHeight: '100vh', padding: '32px 20px 60px' }}><div style={{ maxWidth: 550, margin: 'auto' }}><Link href="/" style={{ color: '#414936' }}>← Back to QuickRating</Link><h1 style={{ fontSize: 30, margin: '35px 0 12px' }}>A home for your customer reviews.</h1><p style={{ color: '#626759', lineHeight: 1.7, marginBottom: 25 }}>This is an illustrative page. The business and testimonials below are fictional; your page will feature your branding and your customers’ own words.</p><ExampleReviewPage /><Link href="/auth/signup" style={{ display: 'block', marginTop: 25, padding: 17, borderRadius: 6, background: '#f6c345', color: '#292b22', textDecoration: 'none', textAlign: 'center', fontWeight: 700 }}>Create your free page →</Link></div></main>;
}
