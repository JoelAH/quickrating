import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ExampleReviewPage from '@/components/exampleReviewPage';
import CONSTANTS from '@/lib/constants';
import base from '@/app/page.module.scss';
import classes from './page.module.scss';

const title = 'Customer Review Pages for Independent Travel Agents';
const description = 'Collect traveler testimonials on your own branded page. Share your reviews with prospective clients on Instagram, WhatsApp, or email. Start with 15 reviews free.';
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: '/landing/travel-agents' },
  openGraph: { title, description, url: '/landing/travel-agents', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
};

export default function TravelAgentsLanding() {
  return <div className={base.page}>
    <a href="#main-content" className={base.skipLink}>Skip to content</a>
    <header className={base.header}>
      <Link href="/" className={base.brand}><Image src="/star.png" alt="" width={29} height={29} />QuickRating.</Link>
      <nav className={base.nav} aria-label="Main navigation"><a href="#how-it-works">How it works</a><Link href="/#pricing">Pricing</Link><Link href="/blog">Resources</Link></nav>
      <div className={base.account}><Link href="/auth/login">Log in</Link><Link href="/auth/signup" className={base.smallButton}>Start free ↗</Link></div>
    </header>
    <main id="main-content">
      <section className={base.hero}>
        <div className={base.heroCopy}><p className={base.eyebrow}><span /> FOR INDEPENDENT TRAVEL AGENTS</p><h1>The next trip<br />starts with<br /><em>a little trust.</em></h1><p className={base.lead}>Give future travelers a place to hear from the people you’ve already helped. Your own review page, ready to share before the booking.</p><div className={base.actions}><Link href="/auth/signup" className={base.primary}>Create your free page ↗</Link><Link href="/demo/review-page" className={base.secondary}>View example →</Link></div><p className={base.finePrint}>{CONSTANTS.freeReviewLimit} reviews free <span>·</span> No website needed</p></div>
        <div className={base.heroPreview}><div className={base.previewLabel}>✦ REAL EXPERIENCES HAVE A PLACE HERE</div><ExampleReviewPage /><p className={base.previewCaption}>A home for the memories you helped make.</p></div>
      </section>
      <div className={base.channelStrip}><span>One review link. Every conversation.</span><div>Travel inquiries <i>✦</i> Instagram bio <i>✦</i> WhatsApp follow-ups <i>✦</i> Email signature</div></div>
      <section className={classes.conversationSection}>
        <div><p className={base.eyebrow}>BEFORE THE DEPOSIT, THE QUESTIONS</p><h2>“Have you helped<br />someone like me?”</h2><p>A new client may have questions before trusting you with their holiday. Give them more than a promise: a place to read your past clients’ experiences.</p><p>Keep testimonials together, so you can send one link instead of searching old messages for feedback.</p></div>
        <div className={classes.conversation}><p className={classes.chatLabel}>AN EXAMPLE CLIENT CONVERSATION</p><div className={classes.message}>The itinerary looks lovely! Do you have any reviews I could read before booking?</div><div className={classes.reply}>Of course. Here’s what past travelers have shared about their experience.<div>↗ quickrating.page/yourbusiness</div></div><p className={classes.chatNote}>A simple link for a thoughtful follow-up.</p></div>
      </section>
      <section id="how-it-works" className={base.section}><div className={base.sectionHeading}><p className={base.eyebrow}>FROM THE FIRST TRIP TO THE NEXT</p><h2>Make feedback part of the journey.</h2><p>Three small steps. No new website to maintain.</p></div><div className={base.steps}>{[
        ['01', 'Put your name on it', 'Add your business name, welcome message, logo, and contact links. Choose a page color that feels like your brand.'],
        ['02', 'Ask when they get home', 'Send your page link after a trip. Clients share their experience and confirm their email address.'],
        ['03', 'Share with the next traveler', 'Include your reviews in a follow-up, add the page to your bio, or send it when a prospect asks about your work.'],
      ].map(([number, heading, copy]) => <article key={number}><span>{number}</span><h3>{heading}</h3><p>{copy}</p></article>)}</div></section>
      <section className={base.audience}><div><p className={base.eyebrow}>YOUR BUSINESS, IN THEIR WORDS</p><h2>Your clients remember<br />the little things.</h2></div><div className={base.audienceCopy}><p>The patient answers. The well-planned transfer. The extra help when plans change. Give those experiences a home that’s easy to share.</p><p>QuickRating collects customer testimonials. Email confirmation checks access to an inbox; it doesn’t verify a booking or guarantee a future experience.</p><Link href="/#pricing">Explore the free and Standard plans ↗</Link></div></section>
      <section className={base.finalCta}><span aria-hidden="true">✦</span><h2>Let one lovely trip<br />help introduce the next.</h2><Link href="/auth/signup" className={base.primary}>Create your free review page ↗</Link><p>{CONSTANTS.freeReviewLimit} reviews free. No credit card required.</p></section>
    </main>
    <footer className={base.footer}><Link href="/" className={base.brand}><Image src="/star.png" alt="" width={25} height={25} />QuickRating.</Link><p>Good experiences deserve to be shared.</p><nav aria-label="Footer navigation"><Link href="/blog">Resources</Link><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link></nav><small>© {new Date().getFullYear()} QuickRating</small></footer>
  </div>;
}
