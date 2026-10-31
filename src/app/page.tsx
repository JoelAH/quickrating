import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CONSTANTS from '@/lib/constants';
import ExampleReviewPage from '@/components/exampleReviewPage';
import { generateOrganizationSchema, generateWebsiteSchema, generateSoftwareApplicationSchema, generateFAQSchema } from '@/lib/structuredData';
import classes from './page.module.scss';

const title = 'Customer Review Pages for Instagram Businesses | QuickRating';
const description = `Collect customer reviews without a website. Create a branded review page, share it on Instagram or WhatsApp, and start with ${CONSTANTS.freeReviewLimit} reviews free.`;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: '/' },
  openGraph: { title, description, url: '/', type: 'website', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'QuickRating — Give happy customers a place to speak for you' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
};
const faqs = [
  { question: 'Can I collect reviews without a website?', answer: 'Yes. QuickRating hosts your branded review page. Share its link in your Instagram bio, WhatsApp conversations, emails, or messages to customers.' },
  { question: 'What is included in the free plan?', answer: `Your free account includes ${CONSTANTS.freeReviewLimit} customer reviews, a customized page, and automatic publishing. It has no trial expiry and requires no credit card. The separate no-signup trial is limited to 3 reviews for 14 days.` },
  { question: 'Do my customers need a QuickRating account?', answer: 'No. Customers enter their name, rating, feedback, and email address, then confirm a code sent to their inbox. Email confirmation checks access to that address; it does not verify a purchase.' },
  { question: 'How is this different from Google Reviews?', answer: 'QuickRating gives you a standalone page to collect and share customer testimonials. It does not publish reviews to Google or replace a Google Business Profile. It can be useful if your business sells through social media and does not have a website.' },
  { question: 'What changes when I upgrade?', answer: `Standard costs $${CONSTANTS.standardMonthlyPrice} USD per month and includes unlimited reviews, publishing controls, new-review email notifications, and removal of QuickRating branding. On the free plan, completed reviews publish automatically; Standard lets the business curate which testimonials appear.` },
];

export default function Home() {
  const schemas = [generateOrganizationSchema(), generateWebsiteSchema(), generateSoftwareApplicationSchema(), generateFAQSchema(faqs)];
  return (
    <div className={classes.page}>
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />)}
      <a className={classes.skipLink} href="#main-content">Skip to content</a>
      <header className={classes.header}>
        <Link href="/" className={classes.brand} aria-label="QuickRating home"><Image src="/star.png" alt="" width={29} height={29} priority />QuickRating<span className={classes.brandDot}>.</span></Link>
        <nav aria-label="Main navigation" className={classes.nav}><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a><Link href="/blog">Resources</Link></nav>
        <div className={classes.account}><Link href="/auth/login">Log in</Link><Link className={classes.smallButton} href="/auth/signup">Start free <span aria-hidden="true">↗</span></Link></div>
      </header>
      <main id="main-content">
        <section className={classes.hero}>
          <div className={classes.heroCopy}><p className={classes.eyebrow}><span /> FOR BUSINESSES BUILT ON SOCIAL</p><h1>Happy customers.<br />A little more<br /><em>word of mouth.</em></h1><p className={classes.lead}>Give their kind words a home. Collect customer reviews on one beautiful page, then share it with your next customer.</p><div className={classes.actions}><Link className={classes.primary} href="/auth/signup">Create your free page <span aria-hidden="true">↗</span></Link><Link className={classes.secondary} href="/demo/review-page">View example <span aria-hidden="true">→</span></Link></div><p className={classes.finePrint}>{CONSTANTS.freeReviewLimit} reviews free <span>·</span> No credit card <span>·</span> No website needed</p></div>
          <div className={classes.heroPreview}><div className={classes.previewLabel}><span aria-hidden="true">✦</span> YOUR CUSTOMERS, IN THEIR OWN WORDS</div><ExampleReviewPage /><p className={classes.previewCaption}>Your brand. Your link. Their experience.</p></div>
        </section>
        <div className={classes.channelStrip}><span>A home for reviews. A link for everywhere.</span><div>Instagram bio <i>✦</i> WhatsApp chats <i>✦</i> Email signature <i>✦</i> Direct messages</div></div>
        <section id="how-it-works" className={classes.section}>
          <div className={classes.sectionHeading}><p className={classes.eyebrow}>LESS SETUP. MORE SHARING.</p><h2>From “thank you” to<br />“you should try them.”</h2><p>You already do the work people appreciate.<br />Make their feedback easier to find.</p></div>
          <div className={classes.steps}>{[
            ['01', 'Make it yours', 'Add your business name, brand colors, image, and contact details. Get a page with a link you can call your own.'],
            ['02', 'Ask for their experience', 'Send your link after a purchase or a finished project. Customers leave feedback and confirm their email.'],
            ['03', 'Let the words travel', 'Put your page in your bio or share it when a new customer asks about your work. Keep the feedback in one place.'],
          ].map(([number, heading, copy]) => <article key={number}><span>{number}</span><h3>{heading}</h3><p>{copy}</p></article>)}</div>
        </section>
        <section className={classes.audience}><div><p className={classes.eyebrow}>YOU DON’T NEED A BIG WEBSITE</p><h2>Just a business<br />people love.</h2></div><div className={classes.audienceCopy}><p>For independent sellers, freelancers, and service businesses whose next customer starts with a message.</p><p>Instead of digging through old conversations for kind words, send one link to a page of customer testimonials.</p><Link href="/landing/travel-agents">Are you an independent travel agent? <span aria-hidden="true">↗</span></Link></div></section>
        <section id="pricing" className={classes.section}>
          <div className={classes.sectionHeading}><p className={classes.eyebrow}>START SMALL. GROW AT YOUR PACE.</p><h2>Your first {CONSTANTS.freeReviewLimit} reviews are on us.</h2><p>A useful free page today. More room whenever you need it.</p></div>
          <div className={classes.plans}><article className={classes.plan}><p className={classes.planLabel}>BASIC</p><h3>For your first kind words.</h3><div className={classes.price}>$0<span> / forever</span></div><ul><li>{CONSTANTS.freeReviewLimit} customer reviews</li><li>Your own branded review page</li><li>Business and contact details</li><li>Completed reviews publish automatically</li></ul><Link className={classes.secondary} href="/auth/signup">Create your free page <span aria-hidden="true">↗</span></Link><small>Includes QuickRating branding. No card required.</small></article>
          <article className={`${classes.plan} ${classes.paidPlan}`}><p className={classes.planLabel}>STANDARD <span>ROOM TO GROW</span></p><h3>Keep the good words coming.</h3><div className={classes.price}>${CONSTANTS.standardMonthlyPrice}<span> USD / month</span></div><ul><li>Unlimited customer reviews</li><li>Everything in Basic</li><li>New-review email notifications</li><li>Remove QuickRating branding</li><li>Publishing controls for your testimonials</li></ul><Link className={classes.primary} href="/auth/signup">Start free, upgrade later <span aria-hidden="true">↗</span></Link><small>Create an account, then upgrade in your dashboard.</small></article></div>
        </section>
        <section className={classes.faq}><div><p className={classes.eyebrow}>A FEW GOOD QUESTIONS</p><h2>Before you <br />get started.</h2></div><div>{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
        <section className={classes.finalCta}><span aria-hidden="true">✦</span><h2>Your next customer would love<br />to hear from your last one.</h2><Link className={classes.primary} href="/auth/signup">Give your reviews a home <span aria-hidden="true">↗</span></Link><p>Start with {CONSTANTS.freeReviewLimit} reviews, free.</p></section>
      </main>
      <footer className={classes.footer}><Link className={classes.brand} href="/"><Image src="/star.png" alt="" width={25} height={25} />QuickRating.</Link><p>Good experiences deserve to be shared.</p><nav aria-label="Footer navigation"><Link href="/blog">Resources</Link><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link></nav><small>© {new Date().getFullYear()} QuickRating</small></footer>
    </div>
  );
}
